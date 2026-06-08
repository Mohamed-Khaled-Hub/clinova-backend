// Core
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PopulateOptions, Types } from 'mongoose'
// DTOs
import { CreateVisitDto } from '@/modules/visit/dto/create-visit.dto'
import { UpdateVisitDto } from '@/modules/visit/dto/update-visit.dto'
// Enums
import { RolesEnum } from '@/common/enums/roles-permissions.enum'
// Schemas
import {
    Visit,
    VisitDocument,
    PopulatedVisitDocument,
} from '@/modules/visit/schemas/visit.schema'
// Services
import { UserService } from '@/modules/user/user.service'

@Injectable()
export class VisitService {
    constructor(
        @InjectModel(Visit.name)
        private readonly visitModel: Model<VisitDocument>,
        private readonly userService: UserService
    ) {}

    // Helpers
    private getStandardPopulate(): PopulateOptions[] {
        return [
            {
                path: 'patientId',
                select: 'fullNameEn fullNameAr',
            },
            {
                path: 'doctorId',
                select: 'username fullNameEn fullNameAr',
            },
        ]
    }

    private mapToPopulatedVisit(
        visitDoc: VisitDocument | null
    ): PopulatedVisitDocument | null {
        if (!visitDoc) return null

        const visitObj = visitDoc.toJSON()

        const { patientId, doctorId, ...restOfVisit } = visitObj

        return {
            ...restOfVisit,
            patient: patientId,
            doctor: doctorId,
        } as unknown as PopulatedVisitDocument
    }

    private async validateDoctorRole(doctorId: string): Promise<void> {
        const user = await this.userService.findOne(doctorId)

        if (!user) {
            throw new BadRequestException(
                `User with ID "${doctorId}" does not exist.`
            )
        }

        if (user.role?.roleName !== String(RolesEnum.DOCTOR)) {
            throw new BadRequestException(
                `The assigned user must hold a valid ${RolesEnum.DOCTOR} role tier.`
            )
        }
    }

    // POST /visits
    async create(
        createVisitDto: CreateVisitDto
    ): Promise<PopulatedVisitDocument> {
        await this.validateDoctorRole(createVisitDto.doctorId)

        const createdVisit = new this.visitModel({
            ...createVisitDto,
            patientId: new Types.ObjectId(createVisitDto.patientId),
            doctorId: new Types.ObjectId(createVisitDto.doctorId),
        })
        const savedVisit = await createdVisit.save()
        const populated = await savedVisit.populate(this.getStandardPopulate())
        return this.mapToPopulatedVisit(populated) as PopulatedVisitDocument
    }

    // GET /visits
    async findAll(): Promise<PopulatedVisitDocument[]> {
        const visits = await this.visitModel
            .find()
            .populate(this.getStandardPopulate())
            .exec()

        return visits
            .map((visit) => this.mapToPopulatedVisit(visit))
            .filter((visit): visit is PopulatedVisitDocument => visit !== null)
    }

    // GET /visits/:id
    async findOne(id: string): Promise<PopulatedVisitDocument | null> {
        const visit = await this.visitModel
            .findById(id)
            .populate(this.getStandardPopulate())
            .exec()

        return this.mapToPopulatedVisit(visit)
    }

    // GET /visits/patient/:patientId
    async findByPatient(patientId: string): Promise<PopulatedVisitDocument[]> {
        const visits = await this.visitModel
            .find({ patientId: new Types.ObjectId(patientId) })
            .populate(this.getStandardPopulate())
            .sort({ visitDate: -1 })
            .exec()

        return visits
            .map((visit) => this.mapToPopulatedVisit(visit))
            .filter((visit): visit is PopulatedVisitDocument => visit !== null)
    }

    // PATCH /visits/:id
    async update(
        id: string,
        updateVisitDto: UpdateVisitDto
    ): Promise<PopulatedVisitDocument | null> {
        const updatedVisit = await this.visitModel
            .findByIdAndUpdate(id, updateVisitDto, { returnDocument: 'after' })
            .populate(this.getStandardPopulate())
            .exec()

        return this.mapToPopulatedVisit(updatedVisit)
    }

    // DELETE /visits/:id
    async remove(id: string): Promise<VisitDocument | null> {
        return this.visitModel.findByIdAndDelete(id).exec()
    }
}
