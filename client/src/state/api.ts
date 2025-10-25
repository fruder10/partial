import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ===================
   ENUMS (matches schema)
=================== */

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "ToDo",
  WorkInProgress = "WorkInProgress",
  UnderReview = "UnderReview",
  Completed = "Completed",
}

export const StatusLabels: Record<Status, string> = {
  [Status.ToDo]: "To Do",
  [Status.WorkInProgress]: "Work In Progress",
  [Status.UnderReview]: "Under Review",
  [Status.Completed]: "Completed",
};

export enum DeliverableType {
  SystemSubsystemRequirementsSpecificationSRS = "SystemSubsystemRequirementsSpecificationSRS",
  InterfaceControlDocumentICD = "InterfaceControlDocumentICD",
  PreliminaryDesignReviewPDRPackage = "PreliminaryDesignReviewPDRPackage",
  RiskFailureModeEffectsAnalysisFMEADFMEAReport = "RiskFailureModeEffectsAnalysisFMEADFMEAReport",
  DevelopmentVerificationPlanVVMatrix = "DevelopmentVerificationPlanVVMatrix",
  EngineeringDrawingCADModel = "EngineeringDrawingCADModel",
  BillofMaterialsBOM = "BillofMaterialsBOM",
  StressStructuralAnalysisReport = "StressStructuralAnalysisReport",
  ThermalAnalysisReport = "ThermalAnalysisReport",
  ElectricalSchematicsPCBLayouts = "ElectricalSchematicsPCBLayouts",
  DesignforManufacturabilityDFMDesignforTestDFTReviewReport = "DesignforManufacturabilityDFMDesignforTestDFTReviewReport",
  CriticalDesignReviewCDRPackage = "CriticalDesignReviewCDRPackage",
  WorkInstructionsAssemblyProcedures = "WorkInstructionsAssemblyProcedures",
  FirstArticleInspectionFAIReport = "FirstArticleInspectionFAIReport",
  SupplierQualityRecordsCertificatesofConformanceCoC = "SupplierQualityRecordsCertificatesofConformanceCoC",
  TestPlansandProcedures = "TestPlansandProcedures",
  QualificationTestReport = "QualificationTestReport",
  AcceptanceTestProcedureATPReport = "AcceptanceTestProcedureATPReport",
  CalibrationCertificates = "CalibrationCertificates",
  NonConformanceCorrectiveActionReportNCRCAR = "NonConformanceCorrectiveActionReportNCRCAR",
  RequirementsVerificationReport = "RequirementsVerificationReport",
  AsBuiltConfigurationEndItemDataPackage = "AsBuiltConfigurationEndItemDataPackage",
  UserOperationsManual = "UserOperationsManual",
  MaintenanceRepairManualSparePartsList = "MaintenanceRepairManualSparePartsList",
  CertificatesofCompliance = "CertificatesofCompliance",
  LessonsLearnedPostProjectReport = "LessonsLearnedPostProjectReport",
  Other = "Other",
}

export const DeliverableTypeLabels: Record<DeliverableType, string> = {
  [DeliverableType.SystemSubsystemRequirementsSpecificationSRS]: "System/Subsystem Requirements Specification (SRS)",
  [DeliverableType.InterfaceControlDocumentICD]: "Interface Control Document (ICD)",
  [DeliverableType.PreliminaryDesignReviewPDRPackage]: "Preliminary Design Review (PDR) Package",
  [DeliverableType.RiskFailureModeEffectsAnalysisFMEADFMEAReport]: "Risk/Failure Mode & Effects Analysis (FMEA/DFMEA) Report",
  [DeliverableType.DevelopmentVerificationPlanVVMatrix]: "Development & Verification Plan / V&V Matrix",
  [DeliverableType.EngineeringDrawingCADModel]: "Engineering Drawing & CAD Model",
  [DeliverableType.BillofMaterialsBOM]: "Bill of Materials (BOM)",
  [DeliverableType.StressStructuralAnalysisReport]: "Stress/Structural Analysis Report",
  [DeliverableType.ThermalAnalysisReport]: "Thermal Analysis Report",
  [DeliverableType.ElectricalSchematicsPCBLayouts]: "Electrical Schematics / PCB Layouts",
  [DeliverableType.DesignforManufacturabilityDFMDesignforTestDFTReviewReport]: "Design for Manufacturability (DFM) & Design for Test (DFT) Review Report",
  [DeliverableType.CriticalDesignReviewCDRPackage]: "Critical Design Review (CDR) Package",
  [DeliverableType.WorkInstructionsAssemblyProcedures]: "Work Instructions / Assembly Procedures",
  [DeliverableType.FirstArticleInspectionFAIReport]: "First Article Inspection (FAI) Report",
  [DeliverableType.SupplierQualityRecordsCertificatesofConformanceCoC]: "Supplier Quality Records / Certificates of Conformance (CoC)",
  [DeliverableType.TestPlansandProcedures]: "Test Plans and Procedures",
  [DeliverableType.QualificationTestReport]: "Qualification Test Report",
  [DeliverableType.AcceptanceTestProcedureATPReport]: "Acceptance Test Procedure (ATP) & Report",
  [DeliverableType.CalibrationCertificates]: "Calibration Certificates",
  [DeliverableType.NonConformanceCorrectiveActionReportNCRCAR]: "Non-Conformance / Corrective Action Report (NCR/CAR)",
  [DeliverableType.RequirementsVerificationReport]: "Requirements Verification Report",
  [DeliverableType.AsBuiltConfigurationEndItemDataPackage]: "As-Built Configuration / End-Item Data Package",
  [DeliverableType.UserOperationsManual]: "User / Operations Manual",
  [DeliverableType.MaintenanceRepairManualSparePartsList]: "Maintenance & Repair Manual / Spare Parts List",
  [DeliverableType.CertificatesofCompliance]: "Certificates of Compliance",
  [DeliverableType.LessonsLearnedPostProjectReport]: "Lessons-Learned & Post-Project Report",
  [DeliverableType.Other]: "Other",
}

export enum IssueType {
  Defect = "Defect",
  Failure = "Failure",
  RequirementWaiver = "RequirementWaiver",
  NonConformanceReportNCR = "NonConformanceReportNCR",
  ProcessManufacturingIssue = "ProcessManufacturingIssue",
  SupplyChainProcurementIssue = "SupplyChainProcurementIssue",
  IntegrationInterfaceIssue = "IntegrationInterfaceIssue",
  TestVerificationAnomaly = "TestVerificationAnomaly",
  EnvironmentalReliabilityIssue = "EnvironmentalReliabilityIssue",
  ConfigurationDocumentationControlIssue = "ConfigurationDocumentationControlIssue",
  SafetyRegulatoryIssue = "SafetyRegulatoryIssue",
  ProgrammaticRiskItem = "ProgrammaticRiskItem",
  ObsolescenceEndOfLifeIssue = "ObsolescenceEndOfLifeIssue",
  Other = "Other",
}

export const IssueTypeLabels: Record<IssueType, string> = {
  [IssueType.Defect]: "Defect",
  [IssueType.Failure]: "Failure",
  [IssueType.RequirementWaiver]: "Requirement Waiver",
  [IssueType.NonConformanceReportNCR]: "Non-Conformance Report (NCR)",
  [IssueType.ProcessManufacturingIssue]: "Process / Manufacturing Issue",
  [IssueType.SupplyChainProcurementIssue]: "Supply-Chain / Procurement Issue",
  [IssueType.IntegrationInterfaceIssue]: "Integration / Interface Issue",
  [IssueType.TestVerificationAnomaly]: "Test / Verification Anomaly",
  [IssueType.EnvironmentalReliabilityIssue]: "Environmental / Reliability Issue",
  [IssueType.ConfigurationDocumentationControlIssue]: "Configuration / Documentation Control Issue",
  [IssueType.SafetyRegulatoryIssue]: "Safety / Regulatory Issue",
  [IssueType.ProgrammaticRiskItem]: "Programmatic / Risk Item",
  [IssueType.ObsolescenceEndOfLifeIssue]: "Obsolescence / End-of-Life Issue",
  [IssueType.Other]: "Other",
}

export enum WorkItemType {
  Task = "Task",
  Deliverable = "Deliverable",
  Issue = "Issue",
}

/* ===================
   CORE INTERFACES
=================== */

export interface DisciplineTeamToProgram {
  id: number;
  disciplineTeamId: number;
  programId: number;
  disciplineTeam: DisciplineTeam;
}

export interface Program {
  id: number;
  name: string;
  description?: string;
  programManagerUserId?: number;
  startDate: string;
  endDate: string;

  partNumbers?: PartNumber[];
  disciplineTeams?: DisciplineTeamToProgram[];
  milestones?: Milestone[];
  workItems?: WorkItem[];
}

export interface User {
  userId: number;
  cognitoId: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl?: string;
  disciplineTeamId?: number;

  disciplineTeam?: DisciplineTeam;
  authoredWorkItems?: WorkItem[];
  assignedWorkItems?: WorkItem[];
  partNumbers?: PartNumber[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface Milestone {
  id: number;
  name: string;
  description: string;
  date: string;
  programId: number;

  program?: Program;
  workItems?: WorkItem[];
}

export enum PartState {
  Released = "Released",
  UnderReview = "UnderReview",
  InWork = "InWork",
  Implementation = "Implementation",
}

export const PartStateLabels: Record<PartState, string> = {
  [PartState.Released]: "Released",
  [PartState.UnderReview]: "Under Review",
  [PartState.InWork]: "In Work",
  [PartState.Implementation]: "Implementation",
};

export interface PartNumber {
  id: number;
  number: number;
  partName: string;
  level: number;
  state: PartState;
  revisionLevel: string;
  assignedUserId: number;
  programId: number;
  parentId?: number;

  assignedUser?: User;
  program?: Program;
  parent?: PartNumber;
  children?: PartNumber[];
  workItemLinks?: WorkItemToPartNumber[];
}

export interface WorkItem {
  id: number;
  workItemType: WorkItemType;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags?: string;
  dateOpened: string;
  dueDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  percentComplete: number;
  inputStatus: string;
  programId: number;
  dueByMilestoneId: number;
  authorUserId: number;
  assignedUserId: number;

  program: Program;
  dueByMilestone: Milestone;
  authorUser: User;
  assigneeUser: User;
  partNumbers?: WorkItemToPartNumber[];
  attachments?: Attachment[];
  comments?: Comment[];

  issueDetail?: IssueDetail;
  deliverableDetail?: DeliverableDetail;
}

export interface IssueDetail {
  id: number;
  issueType: IssueType;
  rootCause?: string;
  correctiveAction?: string;
}

export interface DeliverableDetail {
  id: number;
  deliverableType: DeliverableType;
}

export interface WorkItemToPartNumber {
  id: number;
  workItemId: number;
  partNumberId: number;
  partNumber?: PartNumber;
}

export interface Attachment {
  id: number;
  fileUrl: string;
  fileName: string;
  dateAttached: string;
  uploadedByUserId: number;
  workItemId?: number;
}

export interface Comment {
  id: number;
  text: string;
  dateCommented: string;
  commenterUserId: number;
  workItemId?: number;
}

export interface DisciplineTeam {
  id: number;
  name: string;
  description: string;
  teamManagerUserId?: number;
  teamManagerUsername?: string;
  teamManagerName?: string;

  users?: User[];
  programs?: Program[];
}

export interface SearchResults {
  workItems?: WorkItem[];
  programs?: Program[];
  users?: User[];
  milestones?: Milestone[];
  partNumbers?: PartNumber[];
}

export interface WorkItemCreateInput {
  workItemType: WorkItemType;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  tags?: string;
  dateOpened?: string;
  dueDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId: number;
  dueByMilestoneId: number;
  authorUserId: number;
  assignedUserId: number;
  issueDetail?: {
    issueType: IssueType;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType: DeliverableType;
  };
  partNumberIds?: number[];
}

export interface WorkItemEditInput {
  workItemType?: WorkItemType;
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  dateOpened?: string;
  dueDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  percentComplete?: number;
  inputStatus?: string;
  programId?: number;
  dueByMilestoneId?: number;
  authorUserId?: number;
  assignedUserId?: number;
  issueDetail?: {
    issueType?: IssueType;
    rootCause?: string;
    correctiveAction?: string;
  };
  deliverableDetail?: {
    deliverableType?: DeliverableType;
  };
  partNumberIds?: number[];
}


/* ===================
   API (RTK Query)
=================== */

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["WorkItems", "Milestones", "PartNumbers", "Programs", "Teams", "Users"],
  endpoints: (build) => ({
    /* ---------- WORK ITEMS ---------- */
    getWorkItems: build.query<WorkItem[], void>({
        query: () => "workItems",
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    getWorkItemById: build.query<WorkItem, number>({
        query: (workItemId) => `workItems/${workItemId}`,
        providesTags: (result, error, workItemId) => [{ type: "WorkItems", id: workItemId }],
    }),

    getWorkItemsByProgram: build.query<WorkItem[], { programId: number }>({
        query: ({ programId }) => `workItems?programId=${programId}`,
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    getWorkItemsByPartNumber: build.query<WorkItem[], { partNumberId: number }>({
        query: ({ partNumberId }) => `workItems?partNumberId=${partNumberId}`,
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    getWorkItemsByUser: build.query<WorkItem[], number>({
        query: (userId) => `workItems/user/${userId}`,
        providesTags: (result) =>
            result
                ? [
                        ...result.map(({ id }) => ({ type: "WorkItems" as const, id })),
                        { type: "WorkItems", id: "LIST" },
                    ]
                : [{ type: "WorkItems", id: "LIST" }],
    }),

    createWorkItem: build.mutation<WorkItem, WorkItemCreateInput>({
        query: (body) => ({
            url: "workItems",
            method: "POST",
            body,
        }),
        invalidatesTags: [{ type: "WorkItems", id: "LIST" }],
    }),

    updateWorkItemStatus: build.mutation<
        WorkItem,
        { workItemId: number; status: string }
    >({
        query: ({ workItemId, status }) => ({
            url: `workItems/${workItemId}/status`,
            method: "PATCH",
            body: { status },
        }),
        // Invalidate the item and the list, so dependent queries refetch
        invalidatesTags: (result, error, { workItemId }) => [
            { type: "WorkItems", id: workItemId },
            { type: "WorkItems", id: "LIST" },
        ],
    }),

    editWorkItem: build.mutation<WorkItem, { workItemId: number; updates: WorkItemEditInput }>({
        query: ({ workItemId, updates }) => ({
            url: `workItems/${workItemId}`,
            method: "PATCH",
            body: updates,
        }),
        invalidatesTags: (result, error, { workItemId }) => [
            { type: "WorkItems", id: workItemId },
            { type: "WorkItems", id: "LIST" },
        ],
    }),

    deleteWorkItem: build.mutation<void, number>({
        query: (workItemId) => ({
            url: `workItems/${workItemId}`,
            method: "DELETE",
        }),
        invalidatesTags: (result, error, workItemId) => [
            { type: "WorkItems", id: workItemId },
            { type: "WorkItems", id: "LIST" },
        ],
    }),


    /* ---------- MILESTONES ---------- */
    getMilestones: build.query<Milestone[], void>({
      query: () => "milestones",
      providesTags: ["Milestones"],
    }),
    getMilestonesByProgram: build.query<Milestone[], { programId: number }>({
      query: ({ programId }) => `milestones?programId=${programId}`,
      providesTags: ["Milestones"],
    }),
    createMilestone: build.mutation<Milestone, Partial<Milestone>>({
      query: (body) => ({
        url: "milestones",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Milestones"],
    }),
    editMilestone: build.mutation<Milestone, { milestoneId: number; updates: Partial<Milestone> }>({
      query: ({ milestoneId, updates }) => ({
        url: `milestones/${milestoneId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { milestoneId }) => [
        { type: "Milestones", id: milestoneId },
        { type: "Milestones", id: "LIST" },
      ],
    }),

    /* ---------- PART NUMBERS ---------- */
    getParts: build.query<PartNumber[], void>({
      query: () => "partNumbers",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PartNumbers" as const, id })),
              { type: "PartNumbers", id: "LIST" },
            ]
          : [{ type: "PartNumbers", id: "LIST" }],
    }),
    getPartsByProgram: build.query<PartNumber[], { programId: number }>({
      query: ({ programId }) => `partNumbers?programId=${programId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PartNumbers" as const, id })),
              { type: "PartNumbers", id: "LIST" },
            ]
          : [{ type: "PartNumbers", id: "LIST" }],
    }),
    getPartsByUser: build.query<PartNumber[], number>({
      query: (userId) => `partNumbers/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PartNumbers" as const, id })),
              { type: "PartNumbers", id: "LIST" },
            ]
          : [{ type: "PartNumbers", id: "LIST" }],
    }),
    createPart: build.mutation<PartNumber, Partial<PartNumber>>({
      query: (body) => ({
        url: "partNumbers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PartNumbers"],
    }),
    editPart: build.mutation<PartNumber, { partNumberId: number; updates: Partial<PartNumber> }>({
      query: ({ partNumberId, updates }) => ({
        url: `partNumbers/${partNumberId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { partNumberId }) => [
        { type: "PartNumbers", id: partNumberId },
        { type: "PartNumbers", id: "LIST" },
      ],
    }),
    deletePart: build.mutation<void, number>({
      query: (partNumberId) => ({
        url: `partNumbers/${partNumberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, partNumberId) => [
        { type: "PartNumbers", id: partNumberId },
        { type: "PartNumbers", id: "LIST" },
      ],
    }),

    /* ---------- PROGRAMS ---------- */
    getPrograms: build.query<Program[], void>({
      query: () => "programs",
      providesTags: ["Programs"],
    }),
    createProgram: build.mutation<Program, Partial<Program>>({
      query: (body) => ({
        url: "programs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Programs"],
    }),
    editProgram: build.mutation<Program, { programId: number; updates: Partial<Program> }>({
      query: ({ programId, updates }) => ({
        url: `programs/${programId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { programId }) => [
        { type: "Programs", id: programId },
        { type: "Programs", id: "LIST" },
      ],
    }),

    /* ---------- TEAMS ---------- */
    getTeams: build.query<DisciplineTeam[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    createTeam: build.mutation<DisciplineTeam, Partial<DisciplineTeam>>({
      query: (body) => ({
        url: "teams",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teams"],
    }),
    editTeam: build.mutation<DisciplineTeam, { teamId: number; updates: Partial<DisciplineTeam> }>({
      query: ({ teamId, updates }) => ({
        url: `teams/${teamId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "Teams", id: teamId },
        { type: "Teams", id: "LIST" },
      ],
    }),

    /* ---------- USERS ---------- */
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getUserById: build.query<User, number>({
      query: (userId) => `users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
    }),

    /* ---------- SEARCH ---------- */
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

/* ===================
   HOOK EXPORTS
=================== */
export const {
  useGetWorkItemsQuery,
  useGetWorkItemByIdQuery,
  useGetWorkItemsByProgramQuery,
  useGetWorkItemsByPartNumberQuery,
  useGetWorkItemsByUserQuery,
  useCreateWorkItemMutation,
  useUpdateWorkItemStatusMutation,
  useEditWorkItemMutation,
  useDeleteWorkItemMutation,

  useGetMilestonesQuery,
  useGetMilestonesByProgramQuery,
  useCreateMilestoneMutation,
  useEditMilestoneMutation,

  useGetPartsQuery,
  useGetPartsByProgramQuery,
  useGetPartsByUserQuery,
  useCreatePartMutation,
  useEditPartMutation,
  useDeletePartMutation,

  useGetProgramsQuery,
  useCreateProgramMutation,
  useEditProgramMutation,

  useGetTeamsQuery,
  useCreateTeamMutation,
  useEditTeamMutation,

  useGetUsersQuery,
  useGetUserByIdQuery,

  useSearchQuery,
} = api;