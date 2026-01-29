/**
 * Governance System Type Definitions
 * Defines the comprehensive data structures for the NXTG-Forge Governance HUD
 * @module governance.types
 */

/**
 * Main governance state container
 * Represents the complete state of the governance system at a point in time
 */
export interface GovernanceState {
  /** Schema version for migration compatibility */
  version: number;
  /** ISO 8601 timestamp of last state update */
  timestamp: string;
  /** Constitutional directive and vision */
  constitution: Constitution;
  /** Active and pending workstreams */
  workstreams: Workstream[];
  /** Sentinel monitoring log entries */
  sentinelLog: SentinelEntry[];
  /** System metadata and synchronization info */
  metadata: GovernanceMetadata;
}

/**
 * Constitutional directive defining project mission
 * Contains the high-level vision and current execution status
 */
export interface Constitution {
  /** Primary directive statement */
  directive: string;
  /** Vision points defining success criteria */
  vision: string[];
  /** Current execution phase */
  status: ConstitutionStatus;
  /** Confidence level (0-100) in current approach */
  confidence: number;
  /** Agent or user who last updated constitution */
  updatedBy?: string;
  /** ISO 8601 timestamp of last update */
  updatedAt?: string;
}

/**
 * Constitutional execution phases
 */
export type ConstitutionStatus = 'PLANNING' | 'EXECUTION' | 'REVIEW' | 'BLOCKED' | 'MONITORING' | 'COMPLETE';

/**
 * Workstream definition for parallel execution tracks
 * Represents an independent unit of work with dependencies
 */
export interface Workstream {
  /** Unique workstream identifier */
  id: string;
  /** Human-readable workstream name */
  name: string;
  /** Detailed workstream description */
  description?: string;
  /** Current workstream status */
  status: WorkstreamStatus;
  /** Risk assessment level */
  risk: RiskLevel;
  /** Responsible agent or user */
  owner?: string;
  /** List of dependent workstream IDs */
  dependencies?: string[];
  /** ISO 8601 timestamp when workstream started */
  startedAt: string;
  /** Estimated completion timestamp */
  estimatedCompletion?: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Detailed workstream metrics */
  metrics?: WorkstreamMetrics;
}

/**
 * Workstream execution states
 */
export type WorkstreamStatus = 'pending' | 'active' | 'blocked' | 'completed' | 'failed';

/**
 * Risk assessment levels
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Detailed metrics for workstream progress tracking
 */
export interface WorkstreamMetrics {
  /** Overall progress percentage */
  progress: number;
  /** Number of completed tasks */
  tasksCompleted: number;
  /** Total number of tasks */
  totalTasks: number;
  /** Number of active blockers */
  blockers: number;
}

/**
 * Sentinel monitoring log entry
 * Represents a single event in the governance monitoring system
 */
export interface SentinelEntry {
  /** Unique log entry identifier */
  id: string;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** Event type classification */
  type: SentinelType;
  /** Event severity level */
  severity: SeverityLevel;
  /** Source agent or system component */
  source: string;
  /** Human-readable event message */
  message: string;
  /** Additional contextual data */
  context?: Record<string, any>;
  /** Flag indicating if user action is required */
  actionRequired?: boolean;
}

/**
 * Sentinel event types for classification
 */
export type SentinelType = 'WARN' | 'ERROR' | 'INFO' | 'CRITICAL' | 'SUCCESS';

/**
 * Event severity levels for prioritization
 */
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * System metadata for governance tracking
 */
export interface GovernanceMetadata {
  /** Current session identifier */
  sessionId: string;
  /** Absolute path to project root */
  projectPath: string;
  /** NXTG-Forge version */
  forgeVersion: string;
  /** ISO 8601 timestamp of last synchronization */
  lastSync: string;
  /** State integrity checksum */
  checksum?: string;
}

/**
 * API Response types for governance endpoints
 */
export interface GovernanceApiResponse<T = GovernanceState> {
  /** Request success status */
  success: boolean;
  /** Response data payload */
  data?: T;
  /** Error message if request failed */
  error?: string;
  /** Additional error details */
  details?: Record<string, any>;
}

/**
 * Governance update request payload
 */
export interface GovernanceUpdateRequest {
  /** Type of update being performed */
  updateType: 'constitution' | 'workstream' | 'sentinel' | 'full';
  /** Partial state update data */
  data: Partial<GovernanceState>;
  /** Source of the update request */
  source: string;
  /** Optional update reason/comment */
  reason?: string;
}

/**
 * Component Props types for React components
 */
export interface GovernanceHUDProps {
  /** Optional CSS class name */
  className?: string;
  /** Enable auto-refresh of data */
  autoRefresh?: boolean;
  /** Refresh interval in milliseconds */
  refreshInterval?: number;
  /** Callback when state updates */
  onStateChange?: (state: GovernanceState) => void;
}

export interface ConstitutionCardProps {
  /** Constitution data to display */
  constitution: Constitution;
  /** Optional CSS class name */
  className?: string;
  /** Enable editing mode */
  editable?: boolean;
  /** Callback when constitution updates */
  onUpdate?: (constitution: Constitution) => void;
}

export interface ImpactMatrixProps {
  /** List of workstreams to visualize */
  workstreams: Workstream[];
  /** Optional CSS class name */
  className?: string;
  /** Enable interactive mode */
  interactive?: boolean;
  /** Callback when workstream is selected */
  onWorkstreamSelect?: (workstream: Workstream) => void;
}

export interface OracleFeedProps {
  /** Sentinel log entries to display */
  logs: SentinelEntry[];
  /** Optional CSS class name */
  className?: string;
  /** Maximum number of entries to display */
  maxEntries?: number;
  /** Filter by severity levels */
  severityFilter?: SeverityLevel[];
  /** Filter by event types */
  typeFilter?: SentinelType[];
}

/**
 * Utility type for workstream status transitions
 */
export interface WorkstreamTransition {
  /** Current workstream status */
  from: WorkstreamStatus;
  /** Target workstream status */
  to: WorkstreamStatus;
  /** Validation function for transition */
  validate?: (workstream: Workstream) => boolean;
  /** Side effects to execute on transition */
  onTransition?: (workstream: Workstream) => void;
}

/**
 * Risk assessment matrix configuration
 */
export interface RiskMatrix {
  /** Risk level definitions */
  levels: Record<RiskLevel, RiskDefinition>;
  /** Risk calculation algorithm */
  calculateRisk: (workstream: Workstream) => RiskLevel;
}

/**
 * Risk level definition
 */
export interface RiskDefinition {
  /** Risk level identifier */
  level: RiskLevel;
  /** Display color for UI */
  color: string;
  /** Minimum threshold value */
  minThreshold: number;
  /** Maximum threshold value */
  maxThreshold: number;
  /** Risk mitigation strategies */
  mitigationStrategies: string[];
}

/**
 * Governance statistics for dashboard
 */
export interface GovernanceStats {
  /** Total number of workstreams */
  totalWorkstreams: number;
  /** Number of active workstreams */
  activeWorkstreams: number;
  /** Number of blocked workstreams */
  blockedWorkstreams: number;
  /** Overall progress percentage */
  overallProgress: number;
  /** Critical events in last 24 hours */
  criticalEvents: number;
  /** System health score (0-100) */
  healthScore: number;
}

/**
 * Type guards for runtime type checking
 */
export const isWorkstreamBlocked = (workstream: Workstream): boolean =>
  workstream.status === 'blocked';

export const isHighRisk = (workstream: Workstream): boolean =>
  workstream.risk === 'high' || workstream.risk === 'critical';

export const isCriticalEvent = (entry: SentinelEntry): boolean =>
  entry.type === 'CRITICAL' || entry.type === 'ERROR';

export const requiresAction = (entry: SentinelEntry): boolean =>
  entry.actionRequired === true;

/**
 * Default values for optional fields
 */
export const DEFAULT_GOVERNANCE_STATE: Partial<GovernanceState> = {
  version: 1,
  timestamp: new Date().toISOString(),
  workstreams: [],
  sentinelLog: [],
};

export const DEFAULT_WORKSTREAM: Partial<Workstream> = {
  status: 'pending',
  risk: 'low',
  progress: 0,
  dependencies: [],
  metrics: {
    progress: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    blockers: 0,
  },
};