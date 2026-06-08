// Core
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, PipelineStage, QueryFilter } from 'mongoose'
// Schemas
import {
    Revenue,
    RevenueDocument,
    PopulatedRevenueDocument,
} from '@/modules/revenue/schemas/revenue.schema'
// Services
import { VisitService } from '@/modules/visit/visit.service'
import { PriceCatalogService } from '@/modules/price-catalog/price-catalog.service'
// DTOs
import { CreateRevenueDto } from '@/modules/revenue/dto/create-revenue.dto'
import { UpdateRevenueDto } from '@/modules/revenue/dto/update-revenue.dto'

@Injectable()
export class RevenueService {
    constructor(
        @InjectModel(Revenue.name)
        private readonly revenueModel: Model<RevenueDocument>,
        private readonly visitService: VisitService,
        private readonly priceCatalogService: PriceCatalogService
    ) {}

    // Helpers
    private getPopulatedRevenuePipeline(
        matchStage: QueryFilter<RevenueDocument> = {}
    ): PipelineStage[] {
        return [
            ...(Object.keys(matchStage).length > 0
                ? [{ $match: matchStage }]
                : []),
            {
                $lookup: {
                    from: 'visits',
                    localField: 'visitId',
                    foreignField: '_id',
                    as: 'visit',
                },
            },
            { $unwind: { path: '$visit', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'visit.patientId',
                    foreignField: '_id',
                    as: 'visit.patient',
                },
            },
            {
                $unwind: {
                    path: '$visit.patient',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'visit.doctorId',
                    foreignField: '_id',
                    as: 'visit.doctor',
                },
            },
            {
                $unwind: {
                    path: '$visit.doctor',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'recordedByUserId',
                    foreignField: '_id',
                    as: 'recordedBy',
                },
            },
            {
                $unwind: {
                    path: '$recordedBy',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    transactionAmount: 1,
                    discountAmount: 1,
                    finalAmount: 1,
                    paymentMethod: 1,
                    status: 1,
                    transactionDate: 1,
                    notes: 1,
                    customFields: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    recordedBy: {
                        _id: '$recordedBy._id',
                        username: '$recordedBy.username',
                        fullNameEn: '$recordedBy.fullNameEn',
                        fullNameAr: '$recordedBy.fullNameAr',
                    },
                    visit: {
                        _id: '$visit._id',
                        visitDate: '$visit.visitDate',
                        visitType: '$visit.visitType',
                        patient: {
                            _id: '$visit.patient._id',
                            fullNameEn: '$visit.patient.fullNameEn',
                            fullNameAr: '$visit.patient.fullNameAr',
                        },
                        doctor: {
                            _id: '$visit.doctor._id',
                            username: '$visit.doctor.username',
                            fullNameEn: '$visit.doctor.fullNameEn',
                            fullNameAr: '$visit.doctor.fullNameAr',
                        },
                    },
                },
            },
        ]
    }

    private calculateFinalAmount(
        transactionAmount: number,
        discountAmount: number
    ): number {
        if (discountAmount > transactionAmount) {
            throw new BadRequestException(
                'Discount amount cannot exceed transaction amount'
            )
        }
        return transactionAmount - discountAmount
    }

    // POST /revenues
    async create(
        createRevenueDto: CreateRevenueDto,
        userId: string
    ): Promise<PopulatedRevenueDocument> {
        const existingRevenue = await this.revenueModel
            .findOne({ visitId: new Types.ObjectId(createRevenueDto.visitId) })
            .exec()

        if (existingRevenue) {
            throw new BadRequestException(
                `A revenue record has already been settled for Visit ID "${createRevenueDto.visitId}". Duplicate entry blocked.`
            )
        }

        let transactionAmount = createRevenueDto.transactionAmount

        if (transactionAmount === undefined || transactionAmount === null) {
            const visit = await this.visitService.findOne(
                createRevenueDto.visitId
            )
            if (!visit) {
                throw new NotFoundException(
                    `Visit ID "${createRevenueDto.visitId}" not found`
                )
            }

            const catalogPrice =
                await this.priceCatalogService.getPriceByVisitType(
                    visit.visitType
                )
            if (catalogPrice === null || catalogPrice === undefined) {
                throw new BadRequestException(
                    `Transaction amount was not provided and no automatic price mapping was found for visit type "${visit.visitType}" in the price catalog.`
                )
            }
            transactionAmount = catalogPrice
        }

        const discountAmount = createRevenueDto.discountAmount ?? 0
        const finalAmount = this.calculateFinalAmount(
            transactionAmount,
            discountAmount
        )

        const createdRevenue = new this.revenueModel({
            ...createRevenueDto,
            transactionAmount,
            visitId: new Types.ObjectId(createRevenueDto.visitId),
            discountAmount,
            finalAmount,
            recordedByUserId: new Types.ObjectId(userId),
        })

        const saved = await createdRevenue.save()
        return (await this.findOne(
            saved._id.toString()
        )) as PopulatedRevenueDocument
    }

    // GET /revenues
    async findAll(): Promise<PopulatedRevenueDocument[]> {
        return this.revenueModel
            .aggregate<PopulatedRevenueDocument>(
                this.getPopulatedRevenuePipeline()
            )
            .exec()
    }

    // GET /revenues/:id
    async findOne(id: string): Promise<PopulatedRevenueDocument | null> {
        const results = await this.revenueModel
            .aggregate<PopulatedRevenueDocument>(
                this.getPopulatedRevenuePipeline({
                    _id: new Types.ObjectId(id),
                })
            )
            .exec()

        return results[0] ?? null
    }

    // GET /revenues/visit/:visitId
    async findByVisit(
        visitId: string
    ): Promise<PopulatedRevenueDocument | null> {
        const results = await this.revenueModel
            .aggregate<PopulatedRevenueDocument>(
                this.getPopulatedRevenuePipeline({
                    visitId: new Types.ObjectId(visitId),
                })
            )
            .exec()

        return results[0] ?? null
    }

    // PATCH /revenues/:id
    async update(
        id: string,
        updateRevenueDto: UpdateRevenueDto,
        userId: string
    ): Promise<PopulatedRevenueDocument | null> {
        const existing = await this.revenueModel.findById(id).exec()
        if (!existing) return null

        const updatePayload = {
            ...updateRevenueDto,
            recordedByUserId: new Types.ObjectId(userId),
        }

        if (
            'transactionAmount' in updatePayload ||
            'discountAmount' in updatePayload
        ) {
            const transactionAmount =
                updatePayload.transactionAmount ?? existing.transactionAmount
            const discountAmount =
                updatePayload.discountAmount ?? existing.discountAmount
            const finalAmount = this.calculateFinalAmount(
                transactionAmount,
                discountAmount
            )

            Object.assign(updatePayload, { finalAmount })
        }

        await this.revenueModel.findByIdAndUpdate(id, updatePayload).exec()
        return this.findOne(id)
    }

    // DELETE /revenues/:id
    async remove(id: string): Promise<RevenueDocument | null> {
        return this.revenueModel.findByIdAndDelete(id).exec()
    }
}
