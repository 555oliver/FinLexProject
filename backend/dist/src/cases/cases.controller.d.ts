import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { CasesService } from './cases.service';
import { UpdateCasePhaseDto } from './dto/update-case-phase.dto';
export declare class CasesController {
    private readonly cases;
    constructor(cases: CasesService);
    create(request: Request & {
        user: AuthUser;
    }): Promise<{
        id: string;
        caseNumber: string;
        currentPhase: number;
        currentPhaseName: "Apertura del caso" | "Asignación de asesor" | "Notificación al broker / entidad" | "Negociación y recuperación parcial" | "Arbitraje / litigio" | "Cierre y devolución final";
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    mine(request: Request & {
        user: AuthUser;
    }): Promise<{
        id: string;
        caseNumber: string;
        currentPhase: number;
        currentPhaseName: "Apertura del caso" | "Asignación de asesor" | "Notificación al broker / entidad" | "Negociación y recuperación parcial" | "Arbitraje / litigio" | "Cierre y devolución final";
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    all(): Promise<{
        user: {
            id: string;
            names: string;
            email: string;
        };
        id: string;
        caseNumber: string;
        currentPhase: number;
        currentPhaseName: "Apertura del caso" | "Asignación de asesor" | "Notificación al broker / entidad" | "Negociación y recuperación parcial" | "Arbitraje / litigio" | "Cierre y devolución final";
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updatePhase(id: string, dto: UpdateCasePhaseDto): Promise<{
        id: string;
        caseNumber: string;
        currentPhase: number;
        currentPhaseName: "Apertura del caso" | "Asignación de asesor" | "Notificación al broker / entidad" | "Negociación y recuperación parcial" | "Arbitraje / litigio" | "Cierre y devolución final";
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
