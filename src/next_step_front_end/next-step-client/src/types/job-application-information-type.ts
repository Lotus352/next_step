export default interface JobApplicationInformationType {
    applicationId: number;
    jobId: number;
    expiryDate: string | null;
    countJobApplications: number | 0;
    interviewProcess: number | null;
}