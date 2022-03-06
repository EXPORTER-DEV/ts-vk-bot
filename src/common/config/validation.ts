import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
    @IsString()
    API_TOKEN: string;

    @IsString()
    MYSQL_HOST: string;

    @IsNumber()
    MYSQL_PORT: number;

    @IsString()
    MYSQL_DATABASE: string;

    @IsString()
    MYSQL_USER: string;

    @IsString()
    MYSQL_PASSWORD: string;
}

export function validation(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
