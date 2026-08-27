import { Repository } from 'typeorm';
import { CaseRecord } from './case.entity';
export declare class CasesService {
    private readonly cases;
    constructor(cases: Repository<CaseRecord>);
    create(userId: string): Promise<{
        id: string;
        caseNumber: string;
        currentPhase: number;
        currentPhaseName: "Apertura del caso" | "Asignación de asesor" | "Notificación al broker / entidad" | "Negociación y recuperación parcial" | "Arbitraje / litigio" | "Cierre y devolución final";
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findForUser(userId: string): Promise<{
        id: string;
        caseNumber: string;
        currentPhase: number;
        currentPhaseName: "Apertura del caso" | "Asignación de asesor" | "Notificación al broker / entidad" | "Negociación y recuperación parcial" | "Arbitraje / litigio" | "Cierre y devolución final";
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    listAll(): Promise<{
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
    updatePhase(id: string, currentPhase: number): Promise<{
        id: string;
        caseNumber: string;
        currentPhase: number;
        currentPhaseName: "Apertura del caso" | "Asignación de asesor" | "Notificación al broker / entidad" | "Negociación y recuperación parcial" | "Arbitraje / litigio" | "Cierre y devolución final";
        progress: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private toResponse;
}
