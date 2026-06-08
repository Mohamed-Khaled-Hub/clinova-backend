// Core
import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
// DTOs
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
// Enums
import { RolesEnum } from '@/common/enums/roles-permissions.enum'
// Services
import { UserService } from '@/modules/user/user.service'
import { RoleService } from '@/modules/role/role.service'

@Injectable()
export class UserSeederService implements OnModuleInit {
    private readonly logger = new Logger(UserSeederService.name)

    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService
    ) {}

    async onModuleInit() {
        await new Promise<void>((resolve) => setTimeout(resolve, 1000))

        this.logger.log('Checking user database seed status...')
        const existingUsers = await this.userService.findAll()
        if (existingUsers && existingUsers.length > 0) {
            this.logger.debug(
                'Database user accounts are already initialized. Skipping user seeder lifecycle.'
            )
            return
        }

        this.logger.log('Executing users database seeds...')
        await this.seedUsers()
    }

    private async seedUsers(): Promise<void> {
        const allRolesInDb = await this.roleService.findAll()

        const seedUsersPayloads = [
            {
                username: 'superadmin',
                fullNameEn: 'System Super Admin',
                fullNameAr: 'المدير العام للنظام',
                roleKey: RolesEnum.SUPER_ADMIN,
            },
            {
                username: 'admin',
                fullNameEn: 'Clinic Manager Admin',
                fullNameAr: 'مدير العيادة',
                roleKey: RolesEnum.ADMIN,
            },
            {
                username: 'doctor',
                fullNameEn: 'Dr. Mohamed Khaled',
                fullNameAr: 'د. محمد خالد',
                roleKey: RolesEnum.DOCTOR,
                specializationEn: 'General Practitioner',
                specializationAr: 'ممارس عام',
            },
            {
                username: 'receptionist',
                fullNameEn: 'Clinic Reception Desk',
                fullNameAr: 'مكتب الاستقبال',
                roleKey: RolesEnum.RECEPTIONIST,
            },
        ]

        for (const account of seedUsersPayloads) {
            const existingUser = await this.userService.findByUsername(
                account.username
            )

            if (existingUser) {
                this.logger.debug(
                    `User account "${account.username}" already exists. Skipping...`
                )
                continue
            }

            const dbRole = allRolesInDb.find(
                (role) => String(role.roleName) === String(account.roleKey)
            )

            if (!dbRole) {
                this.logger.error(
                    `Role configuration mapping "${account.roleKey}" not found in database for user "${account.username}".`
                )
                continue
            }

            const createUserDto: CreateUserDto = {
                username: account.username,
                password: 'Password123',
                roleId: String(dbRole._id),
                fullNameEn: account.fullNameEn,
                fullNameAr: account.fullNameAr,
                specializationEn: account.specializationEn,
                specializationAr: account.specializationAr,
            }

            await this.userService.createRaw(createUserDto)

            this.logger.log(
                `User account seeded successfully: "${account.username}" assigned role -> [${account.roleKey}]`
            )
        }
    }
}
