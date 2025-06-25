export default interface JobCertificationType {
    certificationId: number;
    certificationName: string;
    certificationScore: number | null;
}

export interface JobCertificationRequest {
    certificationId: number;
    certificationScore: number | null;
}