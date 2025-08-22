import { ApiProperty } from '@nestjs/swagger';

// --- DTO for User Profile Data ---
class ProfileDataDto {
    @ApiProperty({ example: 15 }) 
    id: number;

    @ApiProperty({ example: "duyetvan03@gmail.com" }) 
    email: string;

    @ApiProperty({ example: "Duyet" }) 
    name: string;

    @ApiProperty({ example: "0332162386", nullable: true }) 
    phone: string | null;

    @ApiProperty({ example: "Chủ tịch hội đồng quản trị" }) 
    description: string;

    @ApiProperty({ example: "https://jbagy.me/wp-content/uploads/2025/03/Hinh-anh-doremon-cute-2.jpg" }) 
    avatar: string;
}

// --- DTO for GET /profile ---
export class GetProfileResponseDto {
    @ApiProperty({ type: ProfileDataDto })
    data: ProfileDataDto;
}

// --- DTO for PATCH /profile ---
export class UpdateProfileResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Cập nhật người dùng thành công.' })
    message: string;
    @ApiProperty({ type: ProfileDataDto })
    data: ProfileDataDto;
}

// --- DTO for POST /profile (change password) ---
export class ChangePasswordResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    
    @ApiProperty({ example: 'Đổi mật khẩu thành công' })
    message: string;
}
