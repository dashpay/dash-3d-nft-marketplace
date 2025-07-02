/* tslint:disable */
/* eslint-disable */
/**
 * Validate an asset lock proof
 */
export function validateAssetLockProof(proof: AssetLockProof, identity_id?: string | null): boolean;
/**
 * Calculate the credits from an asset lock proof
 */
export function calculateCreditsFromProof(proof: AssetLockProof, duffs_per_credit?: bigint | null): bigint;
/**
 * Create an OutPoint from transaction ID and output index
 */
export function createOutPoint(tx_id: string, output_index: number): Uint8Array;
/**
 * Helper to create an instant asset lock proof from component parts
 */
export function createInstantProofFromParts(transaction: any, output_index: number, instant_lock: any): AssetLockProof;
/**
 * Helper to create a chain asset lock proof from component parts
 */
export function createChainProofFromParts(core_chain_locked_height: number, tx_id: string, output_index: number): AssetLockProof;
/**
 * Generate a new mnemonic phrase
 */
export function generateMnemonic(strength?: MnemonicStrength | null, language?: WordListLanguage | null): string;
/**
 * Validate a mnemonic phrase
 */
export function validateMnemonic(phrase: string, language?: WordListLanguage | null): boolean;
/**
 * Convert mnemonic to seed
 */
export function mnemonicToSeed(phrase: string, passphrase?: string | null, language?: WordListLanguage | null): Uint8Array;
/**
 * Get word list for a language
 */
export function getWordList(language?: WordListLanguage | null): Array<any>;
/**
 * Generate entropy for mnemonic
 */
export function generateEntropy(strength?: MnemonicStrength | null): Uint8Array;
/**
 * Generate a BLS private key
 */
export function generateBlsPrivateKey(): Uint8Array;
/**
 * Derive a BLS public key from a private key
 */
export function blsPrivateKeyToPublicKey(private_key: Uint8Array): Uint8Array;
/**
 * Sign data with a BLS private key
 */
export function blsSign(data: Uint8Array, private_key: Uint8Array): Uint8Array;
/**
 * Verify a BLS signature
 */
export function blsVerify(signature: Uint8Array, data: Uint8Array, public_key: Uint8Array): boolean;
/**
 * Validate a BLS public key
 */
export function validateBlsPublicKey(public_key: Uint8Array): boolean;
/**
 * Aggregate multiple BLS signatures
 */
export function blsAggregateSignatures(signatures: any): Uint8Array;
/**
 * Create a BLS threshold signature share
 */
export function blsCreateThresholdShare(data: Uint8Array, private_key_share: Uint8Array, share_id: number): Uint8Array;
/**
 * Get the size of a BLS signature in bytes
 */
export function getBlsSignatureSize(): number;
/**
 * Get the size of a BLS public key in bytes
 */
export function getBlsPublicKeySize(): number;
/**
 * Get the size of a BLS private key in bytes
 */
export function getBlsPrivateKeySize(): number;
/**
 * Calculate the hash of a state transition
 */
export function calculateStateTransitionHash(state_transition_bytes: Uint8Array): string;
/**
 * Validate a state transition before broadcasting
 */
export function validateStateTransition(state_transition_bytes: Uint8Array, platform_version: number): any;
/**
 * Process broadcast response from the platform
 */
export function processBroadcastResponse(response_bytes: Uint8Array): BroadcastResponse;
/**
 * Process wait for state transition result response
 */
export function processWaitForSTResultResponse(response_bytes: Uint8Array): any;
/**
 * Create a global contract cache instance
 */
export function createContractCache(config?: ContractCacheConfig | null): ContractCache;
/**
 * Integration with WasmCacheManager
 */
export function integrateContractCache(_cache_manager: WasmCacheManager, _contract_cache: ContractCache): void;
/**
 * Fetch contract history
 */
export function fetchContractHistory(sdk: WasmSdk, contract_id: string, start_at_ms?: number | null, limit?: number | null, offset?: number | null): Promise<Array<any>>;
/**
 * Fetch all versions of a contract
 */
export function fetchContractVersions(sdk: WasmSdk, contract_id: string): Promise<Array<any>>;
/**
 * Get schema differences between versions
 */
export function getSchemaChanges(sdk: WasmSdk, contract_id: string, from_version: number, to_version: number): Promise<Array<any>>;
/**
 * Get contract at specific version
 */
export function fetchContractAtVersion(sdk: WasmSdk, contract_id: string, version: number): Promise<any>;
/**
 * Check if contract has updates
 */
export function checkContractUpdates(sdk: WasmSdk, contract_id: string, current_version: number): Promise<boolean>;
/**
 * Get migration guide between versions
 */
export function getMigrationGuide(sdk: WasmSdk, contract_id: string, from_version: number, to_version: number): Promise<any>;
/**
 * Monitor contract for updates
 */
export function monitorContractUpdates(sdk: WasmSdk, contract_id: string, current_version: number, callback: Function, poll_interval_ms?: number | null): Promise<any>;
/**
 * Get the current epoch
 */
export function getCurrentEpoch(sdk: WasmSdk): Promise<Epoch>;
/**
 * Get an epoch by index
 */
export function getEpochByIndex(sdk: WasmSdk, index: number): Promise<Epoch>;
/**
 * Get evonodes for the current epoch
 */
export function getCurrentEvonodes(sdk: WasmSdk): Promise<any>;
/**
 * Get evonodes for a specific epoch
 */
export function getEvonodesForEpoch(sdk: WasmSdk, epoch_index: number): Promise<any>;
/**
 * Get a specific evonode by ProTxHash
 */
export function getEvonodeByProTxHash(sdk: WasmSdk, pro_tx_hash: Uint8Array): Promise<Evonode>;
/**
 * Get the quorum for the current epoch
 */
export function getCurrentQuorum(sdk: WasmSdk): Promise<any>;
/**
 * Calculate the number of blocks in an epoch
 */
export function calculateEpochBlocks(network: string): number;
/**
 * Estimate when the next epoch will start
 */
export function estimateNextEpochTime(sdk: WasmSdk, current_block_height: bigint): Promise<any>;
/**
 * Get epoch info by block height
 */
export function getEpochForBlockHeight(sdk: WasmSdk, block_height: bigint): Promise<Epoch>;
/**
 * Get validator set changes between epochs
 */
export function getValidatorSetChanges(sdk: WasmSdk, from_epoch: number, to_epoch: number): Promise<any>;
/**
 * Get epoch statistics
 */
export function getEpochStats(sdk: WasmSdk, epoch_index: number): Promise<any>;
/**
 * Fetch an identity by ID
 */
export function fetchIdentity(sdk: WasmSdk, identity_id: string, options?: FetchOptions | null): Promise<IdentityWasm>;
/**
 * Fetch a data contract by ID
 */
export function fetchDataContract(sdk: WasmSdk, contract_id: string, options?: FetchOptions | null): Promise<DataContractWasm>;
/**
 * Fetch a document by ID
 */
export function fetchDocument(sdk: WasmSdk, document_id: string, contract_id: string, document_type: string, options?: FetchOptions | null): Promise<any>;
/**
 * Fetch identity balance
 */
export function fetchIdentityBalance(sdk: WasmSdk, identity_id: string, options?: FetchOptions | null): Promise<bigint>;
/**
 * Fetch identity nonce
 */
export function fetchIdentityNonce(sdk: WasmSdk, _identity_id: string, _contract_id: string): Promise<bigint>;
/**
 * Fetch multiple identities by their IDs
 *
 * This implementation fetches identities sequentially. For parallel fetching,
 * JavaScript callers can map over IDs and use Promise.all on individual fetch calls.
 */
export function fetch_identities(sdk: WasmSdk, identity_ids: string[], options?: FetchManyOptions | null): Promise<FetchManyResponse>;
/**
 * Fetch multiple data contracts by their IDs
 */
export function fetch_data_contracts(sdk: WasmSdk, contract_ids: string[], options?: FetchManyOptions | null): Promise<FetchManyResponse>;
/**
 * Fetch multiple documents based on query criteria
 */
export function fetch_documents(_sdk: WasmSdk, query_options: DocumentQueryOptions, options?: FetchManyOptions | null): Promise<FetchManyResponse>;
/**
 * Fetch an identity without proof verification
 */
export function fetchIdentityUnproved(sdk: WasmSdk, identity_id: string, options?: FetchOptions | null): Promise<any>;
/**
 * Fetch a data contract without proof verification
 */
export function fetchDataContractUnproved(sdk: WasmSdk, contract_id: string, options?: FetchOptions | null): Promise<any>;
/**
 * Fetch documents without proof verification
 */
export function fetchDocumentsUnproved(sdk: WasmSdk, contract_id: string, document_type: string, where_clause: any, order_by: any, limit?: number | null, start_at?: Uint8Array | null, options?: FetchOptions | null): Promise<any>;
/**
 * Fetch identity by public key hash without proof
 */
export function fetchIdentityByKeyUnproved(sdk: WasmSdk, public_key_hash: Uint8Array, options?: FetchOptions | null): Promise<any>;
/**
 * Fetch data contract history without proof
 */
export function fetchDataContractHistoryUnproved(sdk: WasmSdk, contract_id: string, start_at_ms?: number | null, limit?: number | null, offset?: number | null, options?: FetchOptions | null): Promise<any>;
/**
 * Batch fetch multiple items without proof
 */
export function fetchBatchUnproved(sdk: WasmSdk, requests: any, options?: FetchOptions | null): Promise<any>;
/**
 * Create a new group
 */
export function createGroup(creator_id: string, name: string, description: string, group_type: string, threshold: number, initial_members: Array<any>, _identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Add member to group
 */
export function addGroupMember(group_id: string, admin_id: string, new_member_id: string, role: string, permissions: Array<any>, _identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Remove member from group
 */
export function removeGroupMember(group_id: string, admin_id: string, member_id: string, _identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Create a group proposal
 */
export function createGroupProposal(group_id: string, proposer_id: string, title: string, description: string, action_type: string, action_data: Uint8Array, duration_hours: number, _identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Vote on group proposal
 */
export function voteOnProposal(proposal_id: string, voter_id: string, approve: boolean, comment: string | null | undefined, _identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Execute approved proposal
 */
export function executeProposal(proposal_id: string, executor_id: string, _identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Fetch group information
 */
export function fetchGroup(sdk: WasmSdk, group_id: string): Promise<Group>;
/**
 * Fetch group members
 */
export function fetchGroupMembers(sdk: WasmSdk, group_id: string): Promise<Array<any>>;
/**
 * Fetch active proposals for a group
 */
export function fetchGroupProposals(sdk: WasmSdk, group_id: string, active_only: boolean): Promise<Array<any>>;
/**
 * Fetch user's groups
 */
export function fetchUserGroups(sdk: WasmSdk, user_id: string): Promise<Array<any>>;
/**
 * Check if user can perform action in group
 */
export function checkGroupPermission(sdk: WasmSdk, group_id: string, user_id: string, permission: string): Promise<boolean>;
/**
 * Fetch identity balance details
 */
export function fetchIdentityBalanceDetails(sdk: WasmSdk, identity_id: string): Promise<IdentityBalance>;
/**
 * Fetch identity revision
 */
export function fetchIdentityRevision(sdk: WasmSdk, identity_id: string): Promise<IdentityRevision>;
/**
 * Fetch complete identity info (balance + revision)
 */
export function fetchIdentityInfo(sdk: WasmSdk, identity_id: string): Promise<IdentityInfo>;
/**
 * Fetch balance history for an identity
 */
export function fetchIdentityBalanceHistory(sdk: WasmSdk, identity_id: string, from_timestamp?: number | null, to_timestamp?: number | null, limit?: number | null): Promise<any>;
/**
 * Check if identity has sufficient balance
 */
export function checkIdentityBalance(sdk: WasmSdk, identity_id: string, required_amount: bigint, use_unconfirmed: boolean): Promise<boolean>;
/**
 * Estimate credits needed for an operation
 */
export function estimateCreditsNeeded(operation_type: string, data_size_bytes?: number | null): bigint;
/**
 * Monitor identity balance changes
 */
export function monitorIdentityBalance(sdk: WasmSdk, identity_id: string, callback: Function, poll_interval_ms?: number | null): Promise<any>;
/**
 * Fetch identity public keys information
 */
export function fetchIdentityKeys(sdk: WasmSdk, identity_id: string): Promise<any>;
/**
 * Fetch identity credit balance in Dash
 */
export function fetchIdentityCreditsInDash(sdk: WasmSdk, identity_id: string): Promise<number>;
/**
 * Batch fetch identity info for multiple identities
 */
export function batchFetchIdentityInfo(sdk: WasmSdk, identity_ids: string[]): Promise<any>;
/**
 * Get identity credit transfer fee estimate
 */
export function estimateCreditTransferFee(amount: bigint, priority?: string | null): bigint;
/**
 * Verify metadata against current state
 */
export function verifyMetadata(metadata: Metadata, current_height: bigint, current_time_ms: number | null | undefined, config: MetadataVerificationConfig): MetadataVerificationResult;
/**
 * Compare two metadata objects and determine which is more recent
 */
export function compareMetadata(metadata1: Metadata, metadata2: Metadata): number;
/**
 * Get the most recent metadata from a list
 */
export function getMostRecentMetadata(metadata_list: any[]): Metadata;
/**
 * Check if metadata is within acceptable staleness bounds
 */
export function isMetadataStale(metadata: Metadata, max_age_ms: bigint, max_height_behind: bigint, current_height?: bigint | null): boolean;
/**
 * Initialize global monitoring
 */
export function initializeMonitoring(enabled: boolean, max_metrics?: number | null): void;
/**
 * Check if global monitor is enabled
 */
export function isGlobalMonitorEnabled(): boolean;
/**
 * Track an async operation
 */
export function trackOperation(operation_name: string, operation_fn: Function): Promise<any>;
/**
 * Perform health check
 */
export function performHealthCheck(sdk: WasmSdk): Promise<HealthCheckResult>;
/**
 * Resource usage information
 */
export function getResourceUsage(): any;
/**
 * Check if identity nonce is cached and fresh
 */
export function checkIdentityNonceCache(identity_id: string): bigint | undefined;
/**
 * Update identity nonce cache
 */
export function updateIdentityNonceCache(identity_id: string, nonce: bigint): void;
/**
 * Check if identity contract nonce is cached and fresh
 */
export function checkIdentityContractNonceCache(identity_id: string, contract_id: string): bigint | undefined;
/**
 * Update identity contract nonce cache
 */
export function updateIdentityContractNonceCache(identity_id: string, contract_id: string, nonce: bigint): void;
/**
 * Increment identity nonce in cache
 */
export function incrementIdentityNonceCache(identity_id: string, increment?: number | null): bigint;
/**
 * Increment identity contract nonce in cache
 */
export function incrementIdentityContractNonceCache(identity_id: string, contract_id: string, increment?: number | null): bigint;
/**
 * Clear identity nonce cache
 */
export function clearIdentityNonceCache(): void;
/**
 * Clear identity contract nonce cache
 */
export function clearIdentityContractNonceCache(): void;
/**
 * Optimize Uint8Array conversions
 */
export function optimizeUint8Array(data: Uint8Array): Uint8Array;
/**
 * Initialize string cache
 */
export function initStringCache(): void;
/**
 * Intern a string to reduce memory usage
 */
export function internString(s: string): string;
/**
 * Clear string cache
 */
export function clearStringCache(): void;
/**
 * Export optimization recommendations
 */
export function getOptimizationRecommendations(): Array<any>;
/**
 * Create prefunded balance allocation
 */
export function createPrefundedBalance(identity_id: string, balance_type: string, amount: bigint, purpose: string, lock_duration_ms: number | null | undefined, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Transfer prefunded balance
 */
export function transferPrefundedBalance(from_identity_id: string, to_identity_id: string, balance_type: string, amount: bigint, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Use prefunded balance
 */
export function usePrefundedBalance(identity_id: string, balance_type: string, amount: bigint, purpose: string, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Release locked balance
 */
export function releasePrefundedBalance(identity_id: string, balance_type: string, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Fetch prefunded balances for identity
 */
export function fetchPrefundedBalances(sdk: WasmSdk, identity_id: string): Promise<Array<any>>;
/**
 * Get specific prefunded balance
 */
export function getPrefundedBalance(sdk: WasmSdk, identity_id: string, balance_type: string): Promise<PrefundedBalance | undefined>;
/**
 * Check if identity has sufficient prefunded balance
 */
export function checkPrefundedBalance(sdk: WasmSdk, identity_id: string, balance_type: string, required_amount: bigint): Promise<boolean>;
/**
 * Get balance allocation history
 */
export function fetchBalanceAllocations(sdk: WasmSdk, identity_id: string, _balance_type: string | null | undefined, active_only: boolean): Promise<Array<any>>;
/**
 * Monitor prefunded balance changes
 */
export function monitorPrefundedBalance(sdk: WasmSdk, identity_id: string, balance_type: string, callback: Function, poll_interval_ms?: number | null): Promise<any>;
/**
 * Execute a request with retry logic
 */
export function executeWithRetry(request_fn: Function, settings: RequestSettings): Promise<any>;
export function prepare_identity_fetch_request(_sdk: WasmSdk, base58_id: string, prove: boolean): Uint8Array;
/**
 * Serialize a GetIdentity request
 */
export function serializeGetIdentityRequest(identity_id: string, prove: boolean): Uint8Array;
/**
 * Deserialize a GetIdentity response
 */
export function deserializeGetIdentityResponse(response_bytes: Uint8Array): any;
/**
 * Serialize a GetDataContract request
 */
export function serializeGetDataContractRequest(contract_id: string, prove: boolean): Uint8Array;
/**
 * Deserialize a GetDataContract response
 */
export function deserializeGetDataContractResponse(response_bytes: Uint8Array): any;
/**
 * Serialize a BroadcastStateTransition request
 */
export function serializeBroadcastRequest(state_transition_bytes: Uint8Array): Uint8Array;
/**
 * Deserialize a BroadcastStateTransition response
 */
export function deserializeBroadcastResponse(response_bytes: Uint8Array): any;
/**
 * Serialize a GetIdentityNonce request
 */
export function serializeGetIdentityNonceRequest(identity_id: string, prove: boolean): Uint8Array;
/**
 * Deserialize a GetIdentityNonce response
 */
export function deserializeGetIdentityNonceResponse(response_bytes: Uint8Array): bigint;
/**
 * Serialize a WaitForStateTransitionResult request
 */
export function serializeWaitForStateTransitionRequest(state_transition_hash: string, prove: boolean): Uint8Array;
/**
 * Deserialize a WaitForStateTransitionResult response
 */
export function deserializeWaitForStateTransitionResponse(response_bytes: Uint8Array): any;
/**
 * Serialize document query parameters
 */
export function serializeDocumentQuery(contract_id: string, document_type: string, where_clause: any, order_by: any, limit: number | null | undefined, start_after: string | null | undefined, prove: boolean): Uint8Array;
/**
 * Deserialize document query response
 */
export function deserializeDocumentQueryResponse(response_bytes: Uint8Array): any;
/**
 * Prepare a state transition for broadcast
 */
export function prepareStateTransitionForBroadcast(state_transition_bytes: Uint8Array): any;
/**
 * Get required signatures for a state transition
 */
export function getRequiredSignaturesForStateTransition(state_transition_bytes: Uint8Array): any;
/**
 * Create a new data contract
 */
export function create_data_contract(owner_id: string, contract_definition: any, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Update an existing data contract
 */
export function update_data_contract(contract_id: string, owner_id: string, contract_definition: any, identity_contract_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Create a simple document batch transition
 *
 * Note: This is a simplified implementation that creates a minimal batch transition.
 * In production, you would need to properly construct the document transitions.
 */
export function create_document_batch_transition(owner_id: string, signature_public_key_id: number): Uint8Array;
/**
 * Create a group state transition info object
 */
export function createGroupStateTransitionInfo(group_contract_position: number, action_id: string | null | undefined, is_proposer: boolean): any;
/**
 * Create a token event for group actions
 */
export function createTokenEventBytes(event_type: string, token_position: number, amount?: number | null, recipient_id?: string | null, note?: string | null): Uint8Array;
/**
 * Create a group action
 */
export function createGroupAction(contract_id: string, proposer_id: string, token_position: number, event_bytes: Uint8Array): Uint8Array;
/**
 * Add group info to a state transition
 */
export function addGroupInfoToStateTransition(state_transition_bytes: Uint8Array, group_info: any): Uint8Array;
/**
 * Get group info from a state transition
 */
export function getGroupInfoFromStateTransition(state_transition_bytes: Uint8Array): any;
/**
 * Create a group member structure
 */
export function createGroupMember(identity_id: string, power: number): any;
/**
 * Validate group configuration
 */
export function validateGroupConfig(members: any, required_power: number, member_power_limit?: number | null): any;
/**
 * Calculate if a group action has enough approvals
 */
export function calculateGroupActionApproval(approvals: any, required_power: number): any;
/**
 * Helper to create a group configuration for data contracts
 */
export function createGroupConfiguration(position: number, required_power: number, member_power_limit: number | null | undefined, members: any): any;
/**
 * Deserialize a group event from bytes
 */
export function deserializeGroupEvent(event_bytes: Uint8Array): any;
/**
 * Serialize a group event from JavaScript object
 */
export function serializeGroupEvent(event_obj: any): Uint8Array;
/**
 * Create a new identity with an asset lock proof
 */
export function createIdentity(asset_lock_proof_bytes: Uint8Array, public_keys: any): Uint8Array;
/**
 * Top up an existing identity with additional credits
 */
export function topUpIdentity(identity_id: string, asset_lock_proof_bytes: Uint8Array): Uint8Array;
/**
 * Update an existing identity (add/remove keys, etc.)
 */
export function update_identity(identity_id: string, revision: bigint, nonce: bigint, _add_public_keys: any, _disable_public_keys: any, _public_keys_disabled_at: bigint | null | undefined, signature_public_key_id: number): Uint8Array;
/**
 * Create a simple identity with a single ECDSA authentication key
 */
export function createBasicIdentity(asset_lock_proof_bytes: Uint8Array, public_key_data: Uint8Array): Uint8Array;
/**
 * Helper to create a standard identity public key configuration
 */
export function createStandardIdentityKeys(): any;
/**
 * Validate public keys for identity creation
 */
export function validateIdentityPublicKeys(public_keys: any): any;
/**
 * Serialize any state transition to bytes
 */
export function serializeStateTransition(state_transition_bytes: Uint8Array): Uint8Array;
/**
 * Deserialize state transition from bytes
 */
export function deserializeStateTransition(bytes: Uint8Array): any;
/**
 * Get the type of a serialized state transition
 */
export function getStateTransitionType(bytes: Uint8Array): StateTransitionTypeWasm;
/**
 * Calculate the hash of a state transition
 */
export function calculateStateTransitionId(bytes: Uint8Array): string;
/**
 * Validate a state transition (basic validation without state)
 */
export function validateStateTransitionStructure(bytes: Uint8Array): any;
/**
 * Check if a state transition requires an identity signature
 */
export function isIdentitySignedStateTransition(bytes: Uint8Array): boolean;
/**
 * Get the identity ID associated with a state transition (if applicable)
 */
export function getStateTransitionIdentityId(bytes: Uint8Array): string | undefined;
/**
 * Get modified data IDs from a state transition
 */
export function getModifiedDataIds(bytes: Uint8Array): any;
/**
 * Extract signable bytes from a state transition (for signing)
 */
export function getStateTransitionSignableBytes(bytes: Uint8Array): Uint8Array;
/**
 * Subscribe to identity balance updates
 */
export function subscribeToIdentityBalanceUpdates(identity_id: string, callback: Function, endpoint?: string | null): SubscriptionHandle;
/**
 * Subscribe to data contract updates
 */
export function subscribeToDataContractUpdates(contract_id: string, callback: Function, endpoint?: string | null): SubscriptionHandle;
/**
 * Subscribe to document updates
 */
export function subscribeToDocumentUpdates(contract_id: string, document_type: string, where_clause: any, callback: Function, endpoint?: string | null): SubscriptionHandle;
/**
 * Subscribe to block headers
 */
export function subscribeToBlockHeaders(callback: Function, endpoint?: string | null): SubscriptionHandle;
/**
 * Subscribe to state transition results
 */
export function subscribeToStateTransitionResults(state_transition_hash: string, callback: Function, endpoint?: string | null): SubscriptionHandle;
/**
 * Subscribe to identity balance updates with automatic cleanup
 */
export function subscribeToIdentityBalanceUpdatesV2(identity_id: string, callback: Function, endpoint?: string | null): SubscriptionHandleV2;
/**
 * Subscribe to data contract updates with automatic cleanup
 */
export function subscribeToDataContractUpdatesV2(contract_id: string, callback: Function, endpoint?: string | null): SubscriptionHandleV2;
/**
 * Subscribe to document updates with automatic cleanup
 */
export function subscribeToDocumentUpdatesV2(contract_id: string, document_type: string, where_clause: any, callback: Function, endpoint?: string | null): SubscriptionHandleV2;
/**
 * Subscribe with custom error and close handlers
 */
export function subscribeWithHandlersV2(subscription_type: string, params: any, on_message: Function, on_error?: Function | null, on_close?: Function | null, endpoint?: string | null): SubscriptionHandleV2;
/**
 * Clean up all active subscriptions
 */
export function cleanupAllSubscriptions(): void;
/**
 * Get count of active subscriptions
 */
export function getActiveSubscriptionCount(): number;
/**
 * Mint new tokens
 */
export function mintTokens(sdk: WasmSdk, token_id: string, amount: number, recipient_identity_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Burn tokens
 */
export function burnTokens(sdk: WasmSdk, token_id: string, amount: number, owner_identity_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Transfer tokens between identities
 */
export function transferTokens(sdk: WasmSdk, token_id: string, amount: number, sender_identity_id: string, recipient_identity_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Freeze tokens for an identity
 */
export function freezeTokens(sdk: WasmSdk, token_id: string, identity_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Unfreeze tokens for an identity
 */
export function unfreezeTokens(sdk: WasmSdk, token_id: string, identity_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Get token balance for an identity
 */
export function getTokenBalance(sdk: WasmSdk, token_id: string, identity_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Get token information
 */
export function getTokenInfo(sdk: WasmSdk, token_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Create a token issuance state transition
 */
export function createTokenIssuance(data_contract_id: string, token_position: number, amount: number, identity_nonce: number, signature_public_key_id: number): Uint8Array;
/**
 * Create a token burn state transition
 */
export function createTokenBurn(data_contract_id: string, token_position: number, amount: number, identity_nonce: number, signature_public_key_id: number): Uint8Array;
/**
 * Get all tokens for a data contract
 */
export function getContractTokens(sdk: WasmSdk, data_contract_id: string, options?: TokenOptions | null): Promise<any>;
/**
 * Get token holders for a specific token
 */
export function getTokenHolders(sdk: WasmSdk, token_id: string, limit?: number | null, offset?: number | null): Promise<any>;
/**
 * Get token transaction history
 */
export function getTokenTransactions(sdk: WasmSdk, token_id: string, limit?: number | null, offset?: number | null): Promise<any>;
/**
 * Create batch token transfer state transition
 */
export function createBatchTokenTransfer(token_id: string, sender_identity_id: string, transfers: any, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Monitor token events
 */
export function monitorTokenEvents(_sdk: WasmSdk, token_id: string, event_types: Array<any> | null | undefined, callback: Function): Promise<any>;
export function verify_identity_by_id(proof: Uint8Array, identity_id: string, is_proof_subset: boolean, platform_version: number): Promise<IdentityWasm>;
export function verify_data_contract_by_id(proof: Uint8Array, contract_id: string, is_proof_subset: boolean, platform_version: number): Promise<DataContractWasm>;
/**
 * Verify documents proof and return verified documents
 *
 * Note: This function requires the data contract to be provided separately
 * because document queries need the contract schema for proper validation.
 */
export function verifyDocuments(_proof: Uint8Array, _contract_id: string, _document_type: string, _where_clause: any, _order_by: any, _limit?: number | null, _start_at?: Uint8Array | null): any;
/**
 * Verify documents proof with a provided contract
 */
export function verifyDocumentsWithContract(_proof: Uint8Array, contract_cbor: Uint8Array, _document_type: string, where_clause: any, order_by: any, _limit?: number | null, _start_at?: Uint8Array | null): any;
/**
 * Verify documents using a serialized query approach
 *
 * This function provides a bridge to wasm-drive-verify that avoids
 * the need for direct drive type dependencies.
 */
export function verifyDocumentsBridge(_proof: Uint8Array, _query: VerifyDocumentQuery): DocumentVerificationResult;
/**
 * Helper function to verify a single document
 *
 * This is a simpler case that might be easier to implement
 */
export function verifySingleDocument(_proof: Uint8Array, contract_cbor: Uint8Array, _document_type: string, document_id: Uint8Array): any;
/**
 * Create a vote state transition
 */
export function createVoteTransition(voter_id: string, poll_id: string, vote_choice: VoteChoice, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Fetch active vote polls
 */
export function fetchActiveVotePolls(sdk: WasmSdk, limit?: number | null): Promise<Array<any>>;
/**
 * Fetch vote poll by ID
 */
export function fetchVotePoll(sdk: WasmSdk, poll_id: string): Promise<VotePoll>;
/**
 * Fetch vote results
 */
export function fetchVoteResults(sdk: WasmSdk, poll_id: string): Promise<VoteResult>;
/**
 * Check if identity has voted
 */
export function hasVoted(_sdk: WasmSdk, voter_id: string, poll_id: string): Promise<boolean>;
/**
 * Get voter's vote
 */
export function getVoterVote(sdk: WasmSdk, voter_id: string, poll_id: string): Promise<string | undefined>;
/**
 * Delegate voting power
 */
export function delegateVotingPower(delegator_id: string, delegate_id: string, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Revoke voting delegation
 */
export function revokeVotingDelegation(delegator_id: string, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Create a new vote poll
 */
export function createVotePoll(creator_id: string, title: string, description: string, duration_days: number, vote_options: Array<any>, identity_nonce: bigint, signature_public_key_id: number): Uint8Array;
/**
 * Get voting power for an identity
 */
export function getVotingPower(_sdk: WasmSdk, identity_id: string): Promise<number>;
/**
 * Monitor vote poll for changes
 */
export function monitorVotePoll(sdk: WasmSdk, poll_id: string, callback: Function, poll_interval_ms?: number | null): Promise<any>;
/**
 * Create a withdrawal from an identity
 */
export function withdrawFromIdentity(sdk: WasmSdk, identity_id: string, amount: number, to_address: string, signature_public_key_id: number, options?: WithdrawalOptions | null): Promise<any>;
/**
 * Create a withdrawal state transition
 */
export function createWithdrawalTransition(identity_id: string, amount: number, to_address: string, output_script: Uint8Array, identity_nonce: number, signature_public_key_id: number, core_fee_per_byte?: number | null): Uint8Array;
/**
 * Get withdrawal status
 */
export function getWithdrawalStatus(sdk: WasmSdk, withdrawal_id: string, options?: WithdrawalOptions | null): Promise<any>;
/**
 * Get all withdrawals for an identity
 */
export function getIdentityWithdrawals(sdk: WasmSdk, identity_id: string, limit?: number | null, offset?: number | null, options?: WithdrawalOptions | null): Promise<any>;
/**
 * Calculate withdrawal fee
 */
export function calculateWithdrawalFee(amount: number, output_script_size: number, core_fee_per_byte?: number | null): number;
/**
 * Broadcast a withdrawal transaction
 */
export function broadcastWithdrawal(sdk: WasmSdk, withdrawal_transition: Uint8Array, options?: WithdrawalOptions | null): Promise<any>;
/**
 * Estimate time until withdrawal is processed
 */
export function estimateWithdrawalTime(sdk: WasmSdk, options?: WithdrawalOptions | null): Promise<any>;
export function verifyFullIdentitiesByPublicKeyHashesVec(proof: Uint8Array, public_key_hashes: any, platform_version_number: number): VerifyFullIdentitiesByPublicKeyHashesResult;
export function verifyFullIdentitiesByPublicKeyHashesMap(proof: Uint8Array, public_key_hashes: any, platform_version_number: number): VerifyFullIdentitiesByPublicKeyHashesResult;
export function verifyFullIdentityByIdentityId(proof: Uint8Array, is_proof_subset: boolean, identity_id: Uint8Array, platform_version_number: number): VerifyFullIdentityByIdentityIdResult;
export function verifyFullIdentityByNonUniquePublicKeyHash(identity_proof: Uint8Array | null | undefined, identity_id_public_key_hash_proof: Uint8Array, public_key_hash: Uint8Array, after: Uint8Array | null | undefined, platform_version_number: number): VerifyFullIdentityByNonUniquePublicKeyHashResult;
export function verifyFullIdentityByUniquePublicKeyHash(proof: Uint8Array, public_key_hash: Uint8Array, platform_version_number: number): VerifyFullIdentityByUniquePublicKeyHashResult;
export function verifyIdentitiesContractKeys(proof: Uint8Array, identity_ids: Array<any>, contract_id: Uint8Array, document_type_name: string | null | undefined, purposes: Array<any>, is_proof_subset: boolean, platform_version_number: number): VerifyIdentitiesContractKeysResult;
export function verifyIdentityBalanceAndRevisionForIdentityId(proof: Uint8Array, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyIdentityBalanceAndRevisionForIdentityIdResult;
export function verifyIdentityBalanceForIdentityId(proof: Uint8Array, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyIdentityBalanceForIdentityIdResult;
export function verifyIdentityBalancesForIdentityIdsVec(proof: Uint8Array, is_proof_subset: boolean, identity_ids: any, platform_version_number: number): VerifyIdentityBalancesForIdentityIdsResult;
export function verifyIdentityBalancesForIdentityIdsMap(proof: Uint8Array, is_proof_subset: boolean, identity_ids: any, platform_version_number: number): VerifyIdentityBalancesForIdentityIdsResult;
export function verifyIdentityContractNonce(proof: Uint8Array, identity_id: Uint8Array, contract_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyIdentityContractNonceResult;
export function verifyIdentityIdByNonUniquePublicKeyHash(proof: Uint8Array, is_proof_subset: boolean, public_key_hash: Uint8Array, after: Uint8Array | null | undefined, platform_version_number: number): VerifyIdentityIdByNonUniquePublicKeyHashResult;
export function verifyIdentityIdByUniquePublicKeyHash(proof: Uint8Array, is_proof_subset: boolean, public_key_hash: Uint8Array, platform_version_number: number): VerifyIdentityIdByUniquePublicKeyHashResult;
export function verifyIdentityIdsByUniquePublicKeyHashesVec(proof: Uint8Array, is_proof_subset: boolean, public_key_hashes: any, platform_version_number: number): VerifyIdentityIdsByUniquePublicKeyHashesResult;
export function verifyIdentityIdsByUniquePublicKeyHashesMap(proof: Uint8Array, is_proof_subset: boolean, public_key_hashes: any, platform_version_number: number): VerifyIdentityIdsByUniquePublicKeyHashesResult;
export function verifyIdentityKeysByIdentityId(proof: Uint8Array, identity_id: Uint8Array, specific_key_ids: Array<any> | null | undefined, with_revision: boolean, with_balance: boolean, is_proof_subset: boolean, limit: number | null | undefined, offset: number | null | undefined, platform_version_number: number): VerifyIdentityKeysByIdentityIdResult;
export function verifyIdentityNonce(proof: Uint8Array, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyIdentityNonceResult;
export function verifyIdentityRevisionForIdentityId(proof: Uint8Array, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyIdentityRevisionForIdentityIdResult;
export function verifyDocumentProof(proof: Uint8Array, contract_js: any, document_type_name: string, where_clauses: any, order_by: any, limit: number | null | undefined, offset: number | null | undefined, start_at: Uint8Array | null | undefined, start_at_included: boolean, block_time_ms: bigint | null | undefined, platform_version_number: number): VerifyDocumentProofResult;
export function verifyDocumentProofKeepSerialized(proof: Uint8Array, contract_js: any, document_type_name: string, where_clauses: any, order_by: any, limit: number | null | undefined, offset: number | null | undefined, start_at: Uint8Array | null | undefined, start_at_included: boolean, block_time_ms: bigint | null | undefined, platform_version_number: number): VerifyDocumentProofKeepSerializedResult;
export function verifyStartAtDocumentInProof(proof: Uint8Array, contract_js: any, document_type_name: string, where_clauses: any, order_by: any, limit: number | null | undefined, offset: number | null | undefined, start_at: Uint8Array | null | undefined, start_at_included: boolean, block_time_ms: bigint | null | undefined, is_proof_subset: boolean, document_id: Uint8Array, platform_version_number: number): VerifyStartAtDocumentInProofResult;
/**
 * Verify a single document proof and keep it serialized
 */
export function verifySingleDocumentProofKeepSerialized(query: SingleDocumentDriveQueryWasm, is_subset: boolean, proof: Uint8Array, platform_version_number: number): SingleDocumentProofResult;
/**
 * Create a SingleDocumentDriveQuery for a non-contested document
 */
export function createSingleDocumentQuery(contract_id: Uint8Array, document_type_name: string, document_type_keeps_history: boolean, document_id: Uint8Array, block_time_ms?: number | null): SingleDocumentDriveQueryWasm;
/**
 * Create a SingleDocumentDriveQuery for a maybe contested document
 */
export function createSingleDocumentQueryMaybeContested(contract_id: Uint8Array, document_type_name: string, document_type_keeps_history: boolean, document_id: Uint8Array, block_time_ms?: number | null): SingleDocumentDriveQueryWasm;
/**
 * Create a SingleDocumentDriveQuery for a contested document
 */
export function createSingleDocumentQueryContested(contract_id: Uint8Array, document_type_name: string, document_type_keeps_history: boolean, document_id: Uint8Array, block_time_ms?: number | null): SingleDocumentDriveQueryWasm;
export function verifyContract(proof: Uint8Array, contract_known_keeps_history: boolean | null | undefined, is_proof_subset: boolean, in_multiple_contract_proof_form: boolean, contract_id: Uint8Array, platform_version_number: number): VerifyContractResult;
export function verifyContractHistory(proof: Uint8Array, contract_id: Uint8Array, start_at_date: bigint, limit: number | null | undefined, offset: number | null | undefined, platform_version_number: number): VerifyContractHistoryResult;
export function verifyTokenBalancesForIdentityIdVec(proof: Uint8Array, token_ids: any, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenBalancesForIdentityIdResult;
export function verifyTokenBalancesForIdentityIdMap(proof: Uint8Array, token_ids: any, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenBalancesForIdentityIdResult;
export function verifyTokenBalancesForIdentityIdsVec(proof: Uint8Array, token_id: Uint8Array, is_proof_subset: boolean, identity_ids: any, platform_version_number: number): VerifyTokenBalancesForIdentityIdsResult;
export function verifyTokenBalancesForIdentityIdsMap(proof: Uint8Array, token_id: Uint8Array, is_proof_subset: boolean, identity_ids: any, platform_version_number: number): VerifyTokenBalancesForIdentityIdsResult;
export function verifyTokenDirectSellingPricesVec(proof: Uint8Array, token_ids: any, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenDirectSellingPricesResult;
export function verifyTokenDirectSellingPricesMap(proof: Uint8Array, token_ids: any, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenDirectSellingPricesResult;
export function verifyTokenInfosForIdentityIdVec(proof: Uint8Array, token_ids: any, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenInfosForIdentityIdResult;
export function verifyTokenInfosForIdentityIdMap(proof: Uint8Array, token_ids: any, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenInfosForIdentityIdResult;
export function verifyTokenInfosForIdentityIdsVec(proof: Uint8Array, token_id: Uint8Array, is_proof_subset: boolean, identity_ids: any, platform_version_number: number): VerifyTokenInfosForIdentityIdsResult;
export function verifyTokenInfosForIdentityIdsMap(proof: Uint8Array, token_id: Uint8Array, is_proof_subset: boolean, identity_ids: any, platform_version_number: number): VerifyTokenInfosForIdentityIdsResult;
export function verifyTokenPreProgrammedDistributionsVec(proof: Uint8Array, token_id: Uint8Array, start_at_timestamp: bigint | null | undefined, start_at_identity_id: Uint8Array | null | undefined, limit: number | null | undefined, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenPreProgrammedDistributionsResult;
export function verifyTokenPreProgrammedDistributionsMap(proof: Uint8Array, token_id: Uint8Array, start_at_timestamp: bigint | null | undefined, start_at_identity_id: Uint8Array | null | undefined, limit: number | null | undefined, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenPreProgrammedDistributionsResult;
export function verifyTokenStatusesVec(proof: Uint8Array, token_ids: any, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenStatusesResult;
export function verifyTokenStatusesMap(proof: Uint8Array, token_ids: any, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenStatusesResult;
export function verifyTokenBalanceForIdentityId(proof: Uint8Array, token_id: Uint8Array, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenBalanceForIdentityIdResult;
export function verifyTokenContractInfo(proof: Uint8Array, token_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenContractInfoResult;
export function verifyTokenDirectSellingPrice(proof: Uint8Array, token_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenDirectSellingPriceResult;
export function verifyTokenInfoForIdentityId(proof: Uint8Array, token_id: Uint8Array, identity_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenInfoForIdentityIdResult;
export function verifyTokenPerpetualDistributionLastPaidTime(proof: Uint8Array, token_id: Uint8Array, identity_id: Uint8Array, distribution_type_js: any, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenPerpetualDistributionLastPaidTimeResult;
export function verifyTokenStatus(proof: Uint8Array, token_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenStatusResult;
export function verifyTokenTotalSupplyAndAggregatedIdentityBalance(proof: Uint8Array, token_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResult;
/**
 * Verify action signers and return as an array of [signer_id, power] pairs
 */
export function verifyActionSignersVec(proof: Uint8Array, contract_id: Uint8Array, group_contract_position: number, action_status: number, action_id: Uint8Array, is_proof_subset: boolean, platform_version_number: number): VerifyActionSignersResult;
/**
 * Verify action signers and return as a map with signer_id as key
 */
export function verifyActionSignersMap(proof: Uint8Array, contract_id: Uint8Array, group_contract_position: number, action_status: number, action_id: Uint8Array, is_proof_subset: boolean, platform_version_number: number): VerifyActionSignersResult;
/**
 * Verify action infos in contract and return as an array of [action_id, action] pairs
 */
export function verifyActionInfosInContractVec(proof: Uint8Array, contract_id: Uint8Array, group_contract_position: number, action_status: number, start_action_id: Uint8Array | null | undefined, start_at_included: boolean | null | undefined, limit: number | null | undefined, is_proof_subset: boolean, platform_version_number: number): VerifyActionInfosInContractResult;
/**
 * Verify action infos in contract and return as a map with action_id as key
 */
export function verifyActionInfosInContractMap(proof: Uint8Array, contract_id: Uint8Array, group_contract_position: number, action_status: number, start_action_id: Uint8Array | null | undefined, start_at_included: boolean | null | undefined, limit: number | null | undefined, is_proof_subset: boolean, platform_version_number: number): VerifyActionInfosInContractResult;
/**
 * Verify group infos in contract and return as an array of [position, group] pairs
 */
export function verifyGroupInfosInContractVec(proof: Uint8Array, contract_id: Uint8Array, start_group_contract_position: number | null | undefined, start_at_included: boolean | null | undefined, limit: number | null | undefined, is_proof_subset: boolean, platform_version_number: number): VerifyGroupInfosInContractResult;
/**
 * Verify group infos in contract and return as a map with position as key
 */
export function verifyGroupInfosInContractMap(proof: Uint8Array, contract_id: Uint8Array, start_group_contract_position: number | null | undefined, start_at_included: boolean | null | undefined, limit: number | null | undefined, is_proof_subset: boolean, platform_version_number: number): VerifyGroupInfosInContractResult;
export function verifyActionSignersTotalPower(proof: Uint8Array, contract_id: Uint8Array, group_contract_position: number, action_status: number | null | undefined, action_id: Uint8Array, action_signer_id: Uint8Array, is_proof_subset: boolean, platform_version_number: number): VerifyActionSignersTotalPowerResult;
export function verifyGroupInfo(proof: Uint8Array, contract_id: Uint8Array, group_contract_position: number, is_proof_subset: boolean, platform_version_number: number): VerifyGroupInfoResult;
export function verifyIdentityVotesGivenProofVec(proof: Uint8Array, query_cbor: Uint8Array, contract_lookup: any, platform_version_number: number): VerifyIdentityVotesGivenProofResult;
export function verifyIdentityVotesGivenProofMap(proof: Uint8Array, query_cbor: Uint8Array, contract_lookup: any, platform_version_number: number): VerifyIdentityVotesGivenProofResult;
export function verifyVotePollsEndDateQueryVec(proof: Uint8Array, query_cbor: Uint8Array, platform_version_number: number): VerifyVotePollsEndDateQueryResult;
export function verifyVotePollsEndDateQueryMap(proof: Uint8Array, query_cbor: Uint8Array, platform_version_number: number): VerifyVotePollsEndDateQueryResult;
export function verifyContestsProof(proof: Uint8Array, contract_cbor: Uint8Array, document_type_name: string, index_name: string, start_at_value: Uint8Array | null | undefined, start_index_values: Array<any> | null | undefined, end_index_values: Array<any> | null | undefined, limit: number | null | undefined, order_ascending: boolean, platform_version_number: number): VerifyContestsProofResult;
export function verifyMasternodeVote(proof: Uint8Array, masternode_pro_tx_hash: Uint8Array, vote_cbor: Uint8Array, data_contract_cbor: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifyMasternodeVoteResult;
export function verifySpecializedBalance(proof: Uint8Array, specialized_balance_id: Uint8Array, verify_subset_of_proof: boolean, platform_version_number: number): VerifySpecializedBalanceResult;
export function verifyVotePollVoteStateProof(proof: Uint8Array, contract_cbor: Uint8Array, document_type_name: string, index_name: string, contested_document_resource_vote_poll_bytes: Uint8Array, result_type: string, allow_include_locked_and_abstaining_vote_tally: boolean, platform_version_number: number): VerifyVotePollVoteStateProofResult;
export function verifyVotePollVotesProof(proof: Uint8Array, contract_cbor: Uint8Array, document_type_name: string, index_name: string, contestant_id: Uint8Array, contested_document_resource_vote_poll_bytes: Uint8Array, start_at: Uint8Array | null | undefined, limit: number | null | undefined, order_ascending: boolean, platform_version_number: number): VerifyVotePollVotesProofResult;
/**
 * Verifies elements at a specific path with given keys
 *
 * **Note**: This function is currently not fully implemented due to limitations in the
 * WASM environment. The Element type from grovedb is not exposed through the verify
 * feature, making it impossible to properly serialize and return element data.
 *
 * For document verification, please use the document-specific verification functions
 * such as `verify_proof_keep_serialized` which are designed to work within these
 * limitations.
 *
 * # Alternative Approaches:
 *
 * 1. For document queries: Use `DriveDocumentQuery.verify_proof_keep_serialized()`
 * 2. For identity queries: Use the identity-specific verification functions
 * 3. For contract queries: Use `verify_contract()`
 *
 * This limitation exists because:
 * - The Element enum from grovedb contains references to internal tree structures
 * - These structures cannot be safely exposed across the WASM boundary
 * - The verify feature intentionally excludes server-side types for security
 */
export function verifyElements(_proof: Uint8Array, _path: Array<any>, _keys: Array<any>, _platform_version_number: number): VerifyElementsResult;
export function verifyEpochInfos(proof: Uint8Array, current_epoch: number, start_epoch: number | null | undefined, count: number, ascending: boolean, platform_version_number: number): VerifyEpochInfosResult;
export function verifyEpochProposersByRangeVec(proof: Uint8Array, epoch_index: number, limit: number | null | undefined, start_at_proposer_id: Uint8Array | null | undefined, start_at_included: boolean | null | undefined, platform_version_number: number): VerifyEpochProposersResult;
export function verifyEpochProposersByRangeMap(proof: Uint8Array, epoch_index: number, limit: number | null | undefined, start_at_proposer_id: Uint8Array | null | undefined, start_at_included: boolean | null | undefined, platform_version_number: number): VerifyEpochProposersResult;
export function verifyEpochProposersByIdsVec(proof: Uint8Array, epoch_index: number, proposer_ids: any, platform_version_number: number): VerifyEpochProposersResult;
export function verifyEpochProposersByIdsMap(proof: Uint8Array, epoch_index: number, proposer_ids: any, platform_version_number: number): VerifyEpochProposersResult;
export function verifyTotalCreditsInSystem(proof: Uint8Array, core_subsidy_halving_interval: number, activation_core_height: number, current_core_height: number, platform_version_number: number): VerifyTotalCreditsInSystemResult;
export function verifyUpgradeState(proof: Uint8Array, platform_version_number: number): VerifyUpgradeStateResult;
export function verifyUpgradeVoteStatus(proof: Uint8Array, start_protx_hash: Uint8Array | null | undefined, count: number, platform_version_number: number): VerifyUpgradeVoteStatusResult;
export function tokenTransitionIntoPathQuery(token_transition_js: any, contract_js: any, owner_id: Uint8Array, platform_version_number: number): TokenTransitionPathQueryResult;
export function tokenBalanceForIdentityIdQuery(token_id: Uint8Array, identity_id: Uint8Array): TokenTransitionPathQueryResult;
export function tokenBalancesForIdentityIdsQuery(token_id: Uint8Array, identity_ids_js: any): TokenTransitionPathQueryResult;
export function tokenInfoForIdentityIdQuery(token_id: Uint8Array, identity_id: Uint8Array): TokenTransitionPathQueryResult;
export function tokenDirectPurchasePriceQuery(token_id: Uint8Array): TokenTransitionPathQueryResult;
export function groupActiveAndClosedActionSingleSignerQuery(contract_id: Uint8Array, group_contract_position: number, action_id: Uint8Array, identity_id: Uint8Array): TokenTransitionPathQueryResult;
export function verifyStateTransitionWasExecutedWithProof(state_transition_js: any, block_height: bigint, block_time_ms: bigint, block_core_height: number, proof: Uint8Array, known_contracts_js: any, platform_version_number: number): VerifyStateTransitionWasExecutedWithProofResult;
export function main(): void;
/**
 * Balance type for specialized purposes
 */
export enum BalanceType {
  Voting = 0,
  Staking = 1,
  Reserved = 2,
  Escrow = 3,
  Reward = 4,
  Custom = 5,
}
/**
 * Error categories for better error handling in JavaScript
 */
export enum ErrorCategory {
  /**
   * Network-related errors (connection, timeout, etc.)
   */
  Network = 0,
  /**
   * Serialization/deserialization errors
   */
  Serialization = 1,
  /**
   * Validation errors (invalid input, etc.)
   */
  Validation = 2,
  /**
   * Platform errors (from Dash Platform)
   */
  Platform = 3,
  /**
   * Proof verification errors
   */
  ProofVerification = 4,
  /**
   * State transition errors
   */
  StateTransition = 5,
  /**
   * Identity-related errors
   */
  Identity = 6,
  /**
   * Document-related errors
   */
  Document = 7,
  /**
   * Contract-related errors
   */
  Contract = 8,
  /**
   * Unknown or uncategorized errors
   */
  Unknown = 9,
}
/**
 * Group action types for JavaScript
 */
export enum GroupActionType {
  TokenTransfer = 0,
  TokenMint = 1,
  TokenBurn = 2,
  TokenFreeze = 3,
  TokenUnfreeze = 4,
  TokenSetPrice = 5,
  ContractUpdate = 6,
  GroupMemberAdd = 7,
  GroupMemberRemove = 8,
  GroupSettingsUpdate = 9,
  Custom = 10,
}
/**
 * Group types
 */
export enum GroupType {
  Multisig = 0,
  DAO = 1,
  Committee = 2,
  Custom = 3,
}
/**
 * Group member role
 */
export enum MemberRole {
  Owner = 0,
  Admin = 1,
  Member = 2,
  Observer = 3,
}
/**
 * BIP39 mnemonic strength
 */
export enum MnemonicStrength {
  /**
   * 12 words (128 bits)
   */
  Words12 = 128,
  /**
   * 15 words (160 bits)
   */
  Words15 = 160,
  /**
   * 18 words (192 bits)
   */
  Words18 = 192,
  /**
   * 21 words (224 bits)
   */
  Words21 = 224,
  /**
   * 24 words (256 bits)
   */
  Words24 = 256,
}
/**
 * State transition type enum for JavaScript
 */
export enum StateTransitionTypeWasm {
  DataContractCreate = 0,
  Batch = 1,
  IdentityCreate = 2,
  IdentityTopUp = 3,
  DataContractUpdate = 4,
  IdentityUpdate = 5,
  IdentityCreditWithdrawal = 6,
  IdentityCreditTransfer = 7,
  MasternodeVote = 8,
}
/**
 * Vote types
 */
export enum VoteType {
  Yes = 0,
  No = 1,
  Abstain = 2,
}
/**
 * BIP39 word list languages
 */
export enum WordListLanguage {
  English = 0,
  Japanese = 1,
  Korean = 2,
  Spanish = 3,
  ChineseSimplified = 4,
  ChineseTraditional = 5,
  French = 6,
  Italian = 7,
  Czech = 8,
  Portuguese = 9,
}
/**
 * Asset lock proof wrapper for WASM
 */
export class AssetLockProof {
  private constructor();
  free(): void;
  /**
   * Create an instant asset lock proof
   */
  static createInstant(transaction_bytes: Uint8Array, output_index: number, instant_lock_bytes: Uint8Array): AssetLockProof;
  /**
   * Create a chain asset lock proof
   */
  static createChain(core_chain_locked_height: number, out_point_bytes: Uint8Array): AssetLockProof;
  /**
   * Serialize to bytes using bincode
   */
  toBytes(): Uint8Array;
  /**
   * Deserialize from bytes using bincode
   */
  static fromBytes(bytes: Uint8Array): AssetLockProof;
  /**
   * Serialize to JSON-compatible object
   */
  toJSON(): any;
  /**
   * Deserialize from JSON-compatible object
   */
  static fromJSON(json: any): AssetLockProof;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get identity identifier created from this proof
   */
  getIdentityId(): string;
  /**
   * Get the proof type
   */
  readonly proofType: string;
  /**
   * Get the transaction (only for instant proofs)
   */
  readonly transaction: Uint8Array;
  /**
   * Get the output index
   */
  readonly outputIndex: number;
  /**
   * Get the instant lock (if present)
   */
  readonly instantLock: Uint8Array | undefined;
  /**
   * Get the core chain locked height (only for chain proofs)
   */
  readonly coreChainLockedHeight: number | undefined;
  /**
   * Get the outpoint (as bytes)
   */
  readonly outPoint: Uint8Array | undefined;
}
/**
 * Specialized balance allocation
 */
export class BalanceAllocation {
  private constructor();
  free(): void;
  /**
   * Get available amount
   */
  getAvailableAmount(): bigint;
  /**
   * Check if expired
   */
  isExpired(): boolean;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get identity ID
   */
  readonly identityId: string;
  /**
   * Get balance type
   */
  readonly balanceType: string;
  /**
   * Get allocated amount
   */
  readonly allocatedAmount: bigint;
  /**
   * Get used amount
   */
  readonly usedAmount: bigint;
  /**
   * Get allocation timestamp
   */
  readonly allocatedAt: bigint;
  /**
   * Get expiration timestamp
   */
  readonly expiresAt: bigint | undefined;
}
/**
 * Batch operations optimizer
 */
export class BatchOptimizer {
  free(): void;
  /**
   * Create a new batch optimizer
   */
  constructor();
  /**
   * Set batch size
   */
  setBatchSize(size: number): void;
  /**
   * Set max concurrent operations
   */
  setMaxConcurrent(max: number): void;
  /**
   * Get optimal batch count for a given total
   */
  getOptimalBatchCount(total_items: number): number;
  /**
   * Get batch boundaries
   */
  getBatchBoundaries(total_items: number, batch_index: number): object;
}
/**
 * Broadcast options
 */
export class BroadcastOptions {
  free(): void;
  constructor();
  setWaitForConfirmation(wait: boolean): void;
  setRetryCount(count: number): void;
  setTimeoutMs(timeout: number): void;
  readonly waitForConfirmation: boolean;
  readonly retryCount: number;
  readonly timeoutMs: number;
}
/**
 * Response from broadcasting a state transition
 */
export class BroadcastResponse {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  readonly success: boolean;
  readonly transactionId: string | undefined;
  readonly blockHeight: bigint | undefined;
  readonly error: string | undefined;
}
/**
 * Browser-based signer that uses Web Crypto API
 */
export class BrowserSigner {
  free(): void;
  /**
   * Create a new browser signer
   */
  constructor();
  /**
   * Generate a new key pair
   */
  generateKeyPair(key_type: string, public_key_id: number): Promise<any>;
  /**
   * Sign data with a stored key
   */
  signWithStoredKey(data: Uint8Array, public_key_id: number): Promise<Uint8Array>;
}
/**
 * Compression utilities for large data
 */
export class CompressionUtils {
  private constructor();
  free(): void;
  /**
   * Check if data should be compressed based on size
   */
  static shouldCompress(data_size: number): boolean;
  /**
   * Estimate compression ratio
   */
  static estimateCompressionRatio(data: Uint8Array): number;
}
/**
 * Query for contested resources (voting)
 */
export class ContestedResourceQuery {
  free(): void;
  constructor(contract_id: string, document_type: string, index_name: string);
  set setStartValue(value: Uint8Array);
  set setStartIncluded(value: boolean);
  set limit(value: number);
}
/**
 * Advanced contract cache with LRU eviction and smart preloading
 */
export class ContractCache {
  free(): void;
  constructor(config?: ContractCacheConfig | null);
  /**
   * Cache a contract
   */
  cacheContract(contract_bytes: Uint8Array): string;
  /**
   * Get a cached contract
   */
  getCachedContract(contract_id: string): Uint8Array | undefined;
  /**
   * Get contract metadata
   */
  getContractMetadata(contract_id: string): any;
  /**
   * Check if a contract is cached
   */
  isContractCached(contract_id: string): boolean;
  /**
   * Get all cached contract IDs
   */
  getCachedContractIds(): Array<any>;
  /**
   * Get cache statistics
   */
  getCacheStats(): any;
  /**
   * Clear the cache
   */
  clearCache(): void;
  /**
   * Remove expired entries
   */
  cleanupExpired(): number;
  /**
   * Preload contracts based on access patterns
   */
  getPreloadSuggestions(): Array<any>;
}
/**
 * Contract cache configuration
 */
export class ContractCacheConfig {
  free(): void;
  constructor();
  setMaxContracts(max: number): void;
  setTtl(ttl_ms: number): void;
  setCacheHistory(enable: boolean): void;
  setMaxVersionsPerContract(max: number): void;
  setEnablePreloading(enable: boolean): void;
}
/**
 * Contract history entry
 */
export class ContractHistoryEntry {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get contract ID
   */
  readonly contractId: string;
  /**
   * Get version
   */
  readonly version: number;
  /**
   * Get operation type
   */
  readonly operation: string;
  /**
   * Get timestamp
   */
  readonly timestamp: bigint;
  /**
   * Get changes list
   */
  readonly changes: Array<any>;
  /**
   * Get transaction hash
   */
  readonly transactionHash: string | undefined;
}
/**
 * Contract version information
 */
export class ContractVersion {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get version number
   */
  readonly version: number;
  /**
   * Get schema hash
   */
  readonly schemaHash: string;
  /**
   * Get owner ID
   */
  readonly ownerId: string;
  /**
   * Get creation timestamp
   */
  readonly createdAt: bigint;
  /**
   * Get document types count
   */
  readonly documentTypesCount: number;
  /**
   * Get total documents created with this version
   */
  readonly totalDocuments: bigint;
}
/**
 * DAPI Client for making requests to Dash Platform
 */
export class DapiClient {
  free(): void;
  /**
   * Create a new DAPI client
   */
  constructor(config: DapiClientConfig);
  /**
   * Get current endpoint
   */
  getCurrentEndpoint(): string;
  /**
   * Broadcast a state transition
   */
  broadcastStateTransition(state_transition_bytes: Uint8Array, wait: boolean): Promise<any>;
  /**
   * Get identity by ID
   */
  getIdentity(identity_id: string, prove: boolean): Promise<any>;
  /**
   * Get data contract by ID
   */
  getDataContract(contract_id: string, prove: boolean): Promise<any>;
  /**
   * Get documents
   */
  getDocuments(contract_id: string, document_type: string, where_clause: any, order_by: any, limit: number, start_after: string | null | undefined, prove: boolean): Promise<any>;
  /**
   * Get epoch info
   */
  getEpochInfo(epoch: number | null | undefined, prove: boolean): Promise<any>;
  /**
   * Subscribe to state transitions
   */
  subscribeToStateTransitions(_query: any, _callback: Function): Promise<any>;
  /**
   * Get protocol version
   */
  getProtocolVersion(): Promise<any>;
  /**
   * Wait for state transition result
   */
  waitForStateTransitionResult(state_transition_hash: string, timeout_ms?: number | null): Promise<any>;
  /**
   * Get the network type
   */
  readonly network: string;
}
/**
 * DAPI Client configuration
 */
export class DapiClientConfig {
  free(): void;
  constructor(network: string);
  /**
   * Add a custom endpoint
   */
  addEndpoint(endpoint: string): void;
  /**
   * Set timeout in milliseconds
   */
  setTimeout(timeout_ms: number): void;
  /**
   * Set number of retries
   */
  setRetries(retries: number): void;
  /**
   * Get endpoints as JavaScript array
   */
  readonly endpoints: Array<any>;
}
/**
 * Builder for creating data contract transitions
 */
export class DataContractTransitionBuilder {
  free(): void;
  constructor(owner_id: string);
  setContractId(contract_id: string): void;
  setVersion(version: number): void;
  setUserFeeIncrease(fee_increase: number): void;
  setIdentityNonce(nonce: bigint): void;
  setIdentityContractNonce(nonce: bigint): void;
  addDocumentSchema(document_type: string, schema: any): void;
  setContractDefinition(definition: any): void;
  buildCreateTransition(signature_public_key_id: number): Uint8Array;
  buildUpdateTransition(signature_public_key_id: number): Uint8Array;
}
export class DataContractWasm {
  private constructor();
  free(): void;
  toJSON(): any;
  readonly id: string;
  readonly version: number;
  readonly ownerId: string;
}
/**
 * Document transition builder for WASM
 *
 * This is a simplified builder that helps construct document batch transitions.
 */
export class DocumentBatchBuilder {
  free(): void;
  constructor(owner_id: string);
  setUserFeeIncrease(fee_increase: number): void;
  addCreateDocument(contract_id: string, document_type: string, data: any, entropy: Uint8Array): void;
  addDeleteDocument(contract_id: string, document_type: string, document_id: string): void;
  addReplaceDocument(contract_id: string, document_type: string, document_id: string, revision: number, data: any): void;
  build(signature_public_key_id: number): Uint8Array;
}
/**
 * Document query for searching documents
 */
export class DocumentQuery {
  free(): void;
  constructor(contract_id: string, document_type: string);
  addWhereClause(field: string, operator: string, value: any): void;
  addOrderBy(field: string, ascending: boolean): void;
  /**
   * Get where clauses as JavaScript array
   */
  getWhereClauses(): Array<any>;
  /**
   * Get order by clauses as JavaScript array
   */
  getOrderByClauses(): Array<any>;
  get limit(): number | undefined;
  set limit(value: number);
  get offset(): number | undefined;
  set offset(value: number);
  readonly contractId: string;
  readonly documentType: string;
}
/**
 * Document query options for fetching multiple documents
 */
export class DocumentQueryOptions {
  free(): void;
  constructor(contract_id: string, document_type: string);
  setWhereClause(where_clause: any): void;
  setOrderBy(order_by: any): void;
  setLimit(limit: number): void;
  setStartAt(start_at: string): void;
  setStartAfter(start_after: string): void;
}
/**
 * Result of document verification
 */
export class DocumentVerificationResult {
  private constructor();
  free(): void;
  readonly rootHash: Uint8Array;
  readonly documentsJson: string;
}
/**
 * Represents an epoch in the Dash Platform
 */
export class Epoch {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get the epoch index
   */
  readonly index: number;
  /**
   * Get the start block height
   */
  readonly startBlockHeight: bigint;
  /**
   * Get the start block core height
   */
  readonly startBlockCoreHeight: number;
  /**
   * Get the start time in milliseconds
   */
  readonly startTimeMs: bigint;
  /**
   * Get the fee multiplier for this epoch
   */
  readonly feeMultiplier: number;
}
/**
 * Query for epochs
 */
export class EpochQuery {
  free(): void;
  constructor();
  set setStartEpoch(value: number);
  get count(): number | undefined;
  set count(value: number);
  ascending: boolean;
  readonly startEpoch: number | undefined;
}
/**
 * Represents an evonode (evolution node) in the Dash Platform
 */
export class Evonode {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get the ProTxHash
   */
  readonly proTxHash: Uint8Array;
  /**
   * Get the owner address
   */
  readonly ownerAddress: string;
  /**
   * Get the voting address
   */
  readonly votingAddress: string;
  /**
   * Check if this is a high-performance masternode
   */
  readonly isHPMN: boolean;
  /**
   * Get the platform P2P port
   */
  readonly platformP2PPort: number;
  /**
   * Get the platform HTTP port
   */
  readonly platformHTTPPort: number;
  /**
   * Get the node IP address
   */
  readonly nodeIP: string;
}
/**
 * Feature flags for conditional compilation
 */
export class FeatureFlags {
  free(): void;
  /**
   * Create default feature flags (all enabled)
   */
  constructor();
  /**
   * Create minimal feature flags (only essentials)
   */
  static minimal(): FeatureFlags;
  /**
   * Enable identity features
   */
  setEnableIdentity(enable: boolean): void;
  /**
   * Enable contract features
   */
  setEnableContracts(enable: boolean): void;
  /**
   * Enable document features
   */
  setEnableDocuments(enable: boolean): void;
  /**
   * Enable token features
   */
  setEnableTokens(enable: boolean): void;
  /**
   * Enable withdrawal features
   */
  setEnableWithdrawals(enable: boolean): void;
  /**
   * Enable voting features
   */
  setEnableVoting(enable: boolean): void;
  /**
   * Enable cache features
   */
  setEnableCache(enable: boolean): void;
  /**
   * Enable proof verification
   */
  setEnableProofVerification(enable: boolean): void;
  /**
   * Get estimated bundle size reduction
   */
  getEstimatedSizeReduction(): string;
}
export class FetchManyOptions {
  free(): void;
  constructor();
  setProve(prove: boolean): void;
}
export class FetchManyResponse {
  private constructor();
  free(): void;
  readonly items: any;
  readonly metadata: any;
}
/**
 * Options for fetch operations
 */
export class FetchOptions {
  free(): void;
  constructor();
  /**
   * Set the number of retries
   */
  withRetries(retries: number): FetchOptions;
  /**
   * Set the timeout in milliseconds
   */
  withTimeout(timeout_ms: number): FetchOptions;
  /**
   * Set whether to request proof
   */
  withProve(prove: boolean): FetchOptions;
  /**
   * Number of retries for the request
   */
  get retries(): number | undefined;
  /**
   * Number of retries for the request
   */
  set retries(value: number | null | undefined);
  /**
   * Timeout in milliseconds
   */
  get timeout(): number | undefined;
  /**
   * Timeout in milliseconds
   */
  set timeout(value: number | null | undefined);
  /**
   * Whether to request proof
   */
  get prove(): boolean | undefined;
  /**
   * Whether to request proof
   */
  set prove(value: boolean | null | undefined);
}
/**
 * Group information
 */
export class Group {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get group ID
   */
  readonly id: string;
  /**
   * Get group name
   */
  readonly name: string;
  /**
   * Get group description
   */
  readonly description: string;
  /**
   * Get group type
   */
  readonly groupType: string;
  /**
   * Get creation timestamp
   */
  readonly createdAt: bigint;
  /**
   * Get member count
   */
  readonly memberCount: number;
  /**
   * Get threshold for actions
   */
  readonly threshold: number;
  /**
   * Check if group is active
   */
  readonly active: boolean;
}
/**
 * Group member information
 */
export class GroupMember {
  private constructor();
  free(): void;
  /**
   * Check if member has permission
   */
  hasPermission(permission: string): boolean;
  /**
   * Get member identity ID
   */
  readonly identityId: string;
  /**
   * Get member role
   */
  readonly role: string;
  /**
   * Get join timestamp
   */
  readonly joinedAt: bigint;
  /**
   * Get permissions
   */
  readonly permissions: Array<any>;
}
/**
 * Group action proposal
 */
export class GroupProposal {
  private constructor();
  free(): void;
  /**
   * Check if proposal is active
   */
  isActive(): boolean;
  /**
   * Check if proposal is expired
   */
  isExpired(): boolean;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get proposal ID
   */
  readonly id: string;
  /**
   * Get group ID
   */
  readonly groupId: string;
  /**
   * Get proposer ID
   */
  readonly proposerId: string;
  /**
   * Get title
   */
  readonly title: string;
  /**
   * Get description
   */
  readonly description: string;
  /**
   * Get action type
   */
  readonly actionType: string;
  /**
   * Get action data
   */
  readonly actionData: Uint8Array;
  /**
   * Get creation timestamp
   */
  readonly createdAt: bigint;
  /**
   * Get expiration timestamp
   */
  readonly expiresAt: bigint;
  /**
   * Get approval count
   */
  readonly approvals: number;
  /**
   * Get rejection count
   */
  readonly rejections: number;
  /**
   * Check if executed
   */
  readonly executed: boolean;
}
/**
 * HD (Hierarchical Deterministic) key derivation for WASM
 */
export class HDSigner {
  free(): void;
  /**
   * Create a new HD signer from mnemonic
   */
  constructor(mnemonic: string, derivation_path: string);
  /**
   * Generate a new mnemonic
   */
  static generateMnemonic(word_count: number): string;
  /**
   * Derive a key at a specific index
   */
  deriveKey(index: number): Uint8Array;
  /**
   * Get the derivation path
   */
  readonly derivationPath: string;
}
/**
 * Health check result
 */
export class HealthCheckResult {
  private constructor();
  free(): void;
  /**
   * Get overall status
   */
  readonly status: string;
  /**
   * Get individual check results
   */
  readonly checks: Map<any, any>;
  /**
   * Get timestamp
   */
  readonly timestamp: number;
}
/**
 * Query by identifier
 */
export class IdentifierQuery {
  free(): void;
  constructor(id: string);
  readonly id: string;
}
/**
 * Query for multiple identifiers
 */
export class IdentifiersQuery {
  free(): void;
  constructor(ids: string[]);
  readonly ids: string[];
  readonly count: number;
}
/**
 * Identity balance information
 */
export class IdentityBalance {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get confirmed balance
   */
  readonly confirmed: bigint;
  /**
   * Get unconfirmed balance
   */
  readonly unconfirmed: bigint;
  /**
   * Get total balance (confirmed + unconfirmed)
   */
  readonly total: bigint;
}
/**
 * Combined identity info
 */
export class IdentityInfo {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get identity ID
   */
  readonly id: string;
  /**
   * Get balance info
   */
  readonly balance: IdentityBalance;
  /**
   * Get revision info
   */
  readonly revision: IdentityRevision;
}
/**
 * Identity revision information
 */
export class IdentityRevision {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get revision number
   */
  readonly revision: bigint;
  /**
   * Get last update timestamp
   */
  readonly updatedAt: bigint;
  /**
   * Get number of public keys
   */
  readonly publicKeysCount: number;
}
/**
 * Builder for creating identity state transitions
 */
export class IdentityTransitionBuilder {
  free(): void;
  constructor();
  setIdentityId(identity_id: string): void;
  setRevision(revision: bigint): void;
  addPublicKey(public_key: any): void;
  addPublicKeys(public_keys: any): void;
  disablePublicKey(key_id: number): void;
  disablePublicKeys(key_ids: any): void;
  buildCreateTransition(asset_lock_proof_bytes: Uint8Array): Uint8Array;
  buildTopUpTransition(asset_lock_proof_bytes: Uint8Array): Uint8Array;
  buildUpdateTransition(nonce: bigint, signature_public_key_id: number, _public_keys_disabled_at?: bigint | null): Uint8Array;
}
export class IdentityWasm {
  free(): void;
  constructor(platform_version: number);
  setPublicKeys(public_keys: Array<any>): number;
  getBalance(): number;
  setBalance(balance: number): void;
  increaseBalance(amount: number): number;
  reduceBalance(amount: number): number;
  setRevision(revision: number): void;
  getRevision(): number;
  toJSON(): any;
  hash(): Uint8Array;
  getPublicKeyMaxId(): number;
  static fromBuffer(buffer: Uint8Array): IdentityWasm;
  readonly id: string;
  readonly revision: bigint;
  readonly balance: number;
}
/**
 * Query with limit and pagination support
 */
export class LimitQuery {
  free(): void;
  constructor();
  get limit(): number | undefined;
  set limit(value: number);
  get offset(): number | undefined;
  set offset(value: number);
  set setStartKey(value: Uint8Array);
  set setStartIncluded(value: boolean);
}
/**
 * Memory optimization utilities
 */
export class MemoryOptimizer {
  free(): void;
  /**
   * Create a new memory optimizer
   */
  constructor();
  /**
   * Track an allocation
   */
  trackAllocation(size: number): void;
  /**
   * Get allocation statistics
   */
  getStats(): string;
  /**
   * Reset statistics
   */
  reset(): void;
  /**
   * Force garbage collection (hint to JS engine)
   */
  static forceGC(): void;
}
/**
 * Metadata from a Platform response
 */
export class Metadata {
  free(): void;
  /**
   * Create new metadata
   */
  constructor(height: bigint, core_chain_locked_height: number, epoch: number, time_ms: bigint, protocol_version: number, chain_id: string);
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get the block height
   */
  readonly height: bigint;
  /**
   * Get the core chain locked height
   */
  readonly coreChainLockedHeight: number;
  /**
   * Get the epoch
   */
  readonly epoch: number;
  /**
   * Get the time in milliseconds
   */
  readonly timeMs: bigint;
  /**
   * Get the protocol version
   */
  readonly protocolVersion: number;
  /**
   * Get the chain ID
   */
  readonly chainId: string;
}
/**
 * Configuration for metadata verification
 */
export class MetadataVerificationConfig {
  free(): void;
  /**
   * Create default verification config
   */
  constructor();
  /**
   * Set maximum height difference
   */
  setMaxHeightDifference(blocks: bigint): void;
  /**
   * Set maximum time difference
   */
  setMaxTimeDifference(ms: bigint): void;
  /**
   * Enable/disable time verification
   */
  setVerifyTime(verify: boolean): void;
  /**
   * Enable/disable height verification
   */
  setVerifyHeight(verify: boolean): void;
  /**
   * Enable/disable chain ID verification
   */
  setVerifyChainId(verify: boolean): void;
  /**
   * Set expected chain ID
   */
  setExpectedChainId(chain_id: string): void;
}
/**
 * Result of metadata verification
 */
export class MetadataVerificationResult {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Check if metadata is valid
   */
  readonly valid: boolean;
  /**
   * Check if height is valid
   */
  readonly heightValid: boolean | undefined;
  /**
   * Check if time is valid
   */
  readonly timeValid: boolean | undefined;
  /**
   * Check if chain ID is valid
   */
  readonly chainIdValid: boolean | undefined;
  /**
   * Get height difference
   */
  readonly heightDifference: bigint | undefined;
  /**
   * Get time difference in milliseconds
   */
  readonly timeDifferenceMs: bigint | undefined;
  /**
   * Get error message if validation failed
   */
  readonly errorMessage: string | undefined;
}
/**
 * BIP39 mnemonic wrapper
 */
export class Mnemonic {
  private constructor();
  free(): void;
  /**
   * Generate a new mnemonic with the specified strength and language
   */
  static generate(strength: MnemonicStrength, language?: WordListLanguage | null): Mnemonic;
  /**
   * Create a mnemonic from an existing phrase
   */
  static fromPhrase(phrase: string, language?: WordListLanguage | null): Mnemonic;
  /**
   * Create a mnemonic from entropy
   */
  static fromEntropy(entropy: Uint8Array, language?: WordListLanguage | null): Mnemonic;
  /**
   * Generate seed from the mnemonic with optional passphrase
   */
  toSeed(passphrase?: string | null): Uint8Array;
  /**
   * Validate a mnemonic phrase
   */
  static validate(phrase: string, language?: WordListLanguage | null): boolean;
  /**
   * Get the mnemonic phrase as a string
   */
  readonly phrase: string;
  /**
   * Get the mnemonic words as an array
   */
  readonly words: Array<any>;
  /**
   * Get the number of words
   */
  readonly wordCount: number;
  /**
   * Get the entropy as bytes
   */
  readonly entropy: Uint8Array;
}
/**
 * Options for fetching nonces
 */
export class NonceOptions {
  free(): void;
  constructor();
  setCached(cached: boolean): void;
  setProve(prove: boolean): void;
}
/**
 * Response containing nonce information
 */
export class NonceResponse {
  private constructor();
  free(): void;
  readonly nonce: bigint;
  readonly metadata: any;
}
/**
 * Performance metrics for operations
 */
export class PerformanceMetrics {
  private constructor();
  free(): void;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get operation name
   */
  readonly operation: string;
  /**
   * Get duration in milliseconds
   */
  readonly duration: number | undefined;
  /**
   * Get success status
   */
  readonly success: boolean | undefined;
  /**
   * Get error message
   */
  readonly errorMessage: string | undefined;
}
/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  free(): void;
  /**
   * Create a new performance monitor
   */
  constructor();
  /**
   * Mark a performance point
   */
  mark(label: string): void;
  /**
   * Get performance report
   */
  getReport(): string;
  /**
   * Reset measurements
   */
  reset(): void;
}
/**
 * Prefunded balance information
 */
export class PrefundedBalance {
  private constructor();
  free(): void;
  /**
   * Check if currently locked
   */
  isLocked(): boolean;
  /**
   * Get remaining lock time in milliseconds
   */
  getRemainingLockTime(): bigint;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get balance type
   */
  readonly balanceType: string;
  /**
   * Get amount
   */
  readonly amount: bigint;
  /**
   * Get lock expiry timestamp
   */
  readonly lockedUntil: bigint | undefined;
  /**
   * Get purpose description
   */
  readonly purpose: string;
  /**
   * Check if withdrawable
   */
  readonly canWithdraw: boolean;
}
/**
 * Request settings for DAPI calls
 */
export class RequestSettings {
  free(): void;
  /**
   * Create default request settings
   */
  constructor();
  /**
   * Set maximum retries
   */
  setMaxRetries(retries: number): void;
  /**
   * Set initial retry delay
   */
  setInitialRetryDelay(delay_ms: number): void;
  /**
   * Set maximum retry delay
   */
  setMaxRetryDelay(delay_ms: number): void;
  /**
   * Set backoff multiplier
   */
  setBackoffMultiplier(multiplier: number): void;
  /**
   * Set request timeout
   */
  setTimeout(timeout_ms: number): void;
  /**
   * Enable/disable exponential backoff
   */
  setUseExponentialBackoff(use_backoff: boolean): void;
  /**
   * Enable/disable retry on timeout
   */
  setRetryOnTimeout(retry: boolean): void;
  /**
   * Enable/disable retry on network error
   */
  setRetryOnNetworkError(retry: boolean): void;
  /**
   * Set custom headers
   */
  setCustomHeaders(headers: object): void;
  /**
   * Get the delay for a specific retry attempt
   */
  getRetryDelay(attempt: number): number;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
}
/**
 * Builder for creating customized request settings
 */
export class RequestSettingsBuilder {
  free(): void;
  /**
   * Create a new builder
   */
  constructor();
  /**
   * Set max retries
   */
  withMaxRetries(retries: number): RequestSettingsBuilder;
  /**
   * Set timeout
   */
  withTimeout(timeout_ms: number): RequestSettingsBuilder;
  /**
   * Set initial retry delay
   */
  withInitialRetryDelay(delay_ms: number): RequestSettingsBuilder;
  /**
   * Set backoff multiplier
   */
  withBackoffMultiplier(multiplier: number): RequestSettingsBuilder;
  /**
   * Disable retries
   */
  withoutRetries(): RequestSettingsBuilder;
  /**
   * Build the settings
   */
  build(): RequestSettings;
}
/**
 * Retry handler for WASM environment
 */
export class RetryHandler {
  free(): void;
  /**
   * Create a new retry handler
   */
  constructor(settings: RequestSettings);
  /**
   * Check if we should retry
   */
  shouldRetry(error: any): boolean;
  /**
   * Get the next retry delay
   */
  getNextRetryDelay(): number;
  /**
   * Increment attempt counter
   */
  incrementAttempt(): void;
  /**
   * Get elapsed time in milliseconds
   */
  getElapsedTime(): number;
  /**
   * Check if timeout exceeded
   */
  isTimeoutExceeded(): boolean;
  /**
   * Get current attempt number
   */
  readonly currentAttempt: number;
}
/**
 * Contract schema change
 */
export class SchemaChange {
  private constructor();
  free(): void;
  /**
   * Get document type
   */
  readonly documentType: string;
  /**
   * Get change type
   */
  readonly changeType: string;
  /**
   * Get field name
   */
  readonly fieldName: string | undefined;
  /**
   * Get old value
   */
  readonly oldValue: string | undefined;
  /**
   * Get new value
   */
  readonly newValue: string | undefined;
}
/**
 * SDK Monitor for tracking operations and performance
 */
export class SdkMonitor {
  free(): void;
  /**
   * Create a new monitor
   */
  constructor(enabled: boolean, max_metrics?: number | null);
  /**
   * Enable monitoring
   */
  enable(): void;
  /**
   * Disable monitoring
   */
  disable(): void;
  /**
   * Start tracking an operation
   */
  startOperation(operation_id: string, operation_name: string): void;
  /**
   * End tracking an operation
   */
  endOperation(operation_id: string, success: boolean, error_message?: string | null): void;
  /**
   * Add metadata to an active operation
   */
  addOperationMetadata(operation_id: string, key: string, value: string): void;
  /**
   * Get all collected metrics
   */
  getMetrics(): Array<any>;
  /**
   * Get metrics for a specific operation type
   */
  getMetricsByOperation(operation_name: string): Array<any>;
  /**
   * Get operation statistics
   */
  getOperationStats(): any;
  /**
   * Clear all metrics
   */
  clearMetrics(): void;
  /**
   * Get active operations count
   */
  getActiveOperationsCount(): number;
  /**
   * Check if monitoring is enabled
   */
  readonly enabled: boolean;
}
/**
 * WASM wrapper for SingleDocumentDriveQuery
 */
export class SingleDocumentDriveQueryWasm {
  free(): void;
  /**
   * Create a new SingleDocumentDriveQuery
   */
  constructor(contract_id: Uint8Array, document_type_name: string, document_type_keeps_history: boolean, document_id: Uint8Array, block_time_ms: number | null | undefined, contested_status: number);
  /**
   * Get the contract ID
   */
  readonly contractId: Uint8Array;
  /**
   * Get the document type name
   */
  readonly documentTypeName: string;
  /**
   * Get whether the document type keeps history
   */
  readonly documentTypeKeepsHistory: boolean;
  /**
   * Get the document ID
   */
  readonly documentId: Uint8Array;
  /**
   * Get the block time in milliseconds
   */
  readonly blockTimeMs: number | undefined;
  /**
   * Get the contested status
   */
  readonly contestedStatus: number;
}
/**
 * Result of a single document proof verification
 */
export class SingleDocumentProofResult {
  private constructor();
  free(): void;
  /**
   * Check if a document was found
   */
  hasDocument(): boolean;
  /**
   * Get the root hash
   */
  readonly rootHash: Uint8Array;
  /**
   * Get the serialized document (if found)
   */
  readonly documentSerialized: Uint8Array | undefined;
}
/**
 * WebSocket subscription handle
 */
export class SubscriptionHandle {
  private constructor();
  free(): void;
  /**
   * Close the subscription
   */
  close(): void;
  /**
   * Get the subscription ID
   */
  readonly id: string;
  /**
   * Check if the subscription is active
   */
  readonly isActive: boolean;
}
/**
 * Enhanced WebSocket subscription handle with automatic cleanup
 */
export class SubscriptionHandleV2 {
  private constructor();
  free(): void;
  /**
   * Close the subscription and clean up resources
   */
  close(): void;
  /**
   * Get the subscription ID
   */
  readonly id: string;
  /**
   * Check if the subscription is active
   */
  readonly isActive: boolean;
}
/**
 * Connection options for subscriptions
 */
export class SubscriptionOptions {
  free(): void;
  constructor();
  /**
   * Reconnect automatically on disconnect
   */
  auto_reconnect: boolean;
  /**
   * Maximum reconnection attempts
   */
  max_reconnect_attempts: number;
  /**
   * Reconnection delay in milliseconds
   */
  reconnect_delay_ms: number;
  /**
   * Connection timeout in milliseconds
   */
  connection_timeout_ms: number;
}
/**
 * Token metadata structure
 */
export class TokenMetadata {
  private constructor();
  free(): void;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly iconUrl: string | undefined;
  readonly description: string | undefined;
}
/**
 * Options for token operations
 */
export class TokenOptions {
  free(): void;
  constructor();
  /**
   * Set the number of retries
   */
  withRetries(retries: number): TokenOptions;
  /**
   * Set the timeout in milliseconds
   */
  withTimeout(timeout_ms: number): TokenOptions;
}
export class TokenTransitionPathQueryResult {
  private constructor();
  free(): void;
  readonly path_query: any;
}
export class VerifyActionInfosInContractResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly actions: any;
}
export class VerifyActionSignersResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly signers: any;
}
export class VerifyActionSignersTotalPowerResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly action_status: number;
  readonly total_power: bigint;
}
export class VerifyContestsProofResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly contests: Array<any>;
}
export class VerifyContractHistoryResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly contract_history: any;
}
export class VerifyContractResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly contract: any;
}
export class VerifyDocumentProofKeepSerializedResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly serialized_documents: any;
}
export class VerifyDocumentProofResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly documents: any;
}
/**
 * Query parameters for document verification
 */
export class VerifyDocumentQuery {
  free(): void;
  constructor(contract_cbor: Uint8Array, document_type: string);
  setWhere(where_json: string): void;
  setOrderBy(order_by_json: string): void;
  setLimit(limit: number): void;
  setStartAt(start_at: Uint8Array): void;
}
export class VerifyElementsResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly elements: any;
}
export class VerifyEpochInfosResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly epoch_infos: any;
}
export class VerifyEpochProposersResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly proposers: any;
}
export class VerifyFullIdentitiesByPublicKeyHashesResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identities: any;
}
export class VerifyFullIdentityByIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identity: any;
}
export class VerifyFullIdentityByNonUniquePublicKeyHashResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identity: any;
}
export class VerifyFullIdentityByUniquePublicKeyHashResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identity: any;
}
export class VerifyGroupInfoResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly group: any;
}
export class VerifyGroupInfosInContractResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly groups: any;
}
export class VerifyIdentitiesContractKeysResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly keys: any;
}
export class VerifyIdentityBalanceAndRevisionForIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly balance: bigint | undefined;
  readonly revision: bigint | undefined;
}
export class VerifyIdentityBalanceForIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly balance: bigint | undefined;
}
export class VerifyIdentityBalancesForIdentityIdsResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly balances: any;
}
export class VerifyIdentityContractNonceResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly nonce: bigint | undefined;
}
export class VerifyIdentityIdByNonUniquePublicKeyHashResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identity_id: Uint8Array | undefined;
}
export class VerifyIdentityIdByUniquePublicKeyHashResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identity_id: Uint8Array | undefined;
}
export class VerifyIdentityIdsByUniquePublicKeyHashesResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identity_ids: any;
}
export class VerifyIdentityKeysByIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly identity: any;
}
export class VerifyIdentityNonceResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly nonce: bigint | undefined;
}
export class VerifyIdentityRevisionForIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly revision: bigint | undefined;
}
export class VerifyIdentityVotesGivenProofResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly votes: any;
}
export class VerifyMasternodeVoteResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly vote: Uint8Array | undefined;
}
export class VerifySpecializedBalanceResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly balance: bigint | undefined;
}
export class VerifyStartAtDocumentInProofResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly document: any;
}
export class VerifyStateTransitionWasExecutedWithProofResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly proof_result: any;
}
export class VerifyTokenBalanceForIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly balance: bigint | undefined;
}
export class VerifyTokenBalancesForIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly balances: any;
}
export class VerifyTokenBalancesForIdentityIdsResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly balances: any;
}
export class VerifyTokenContractInfoResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly contract_info: any;
}
export class VerifyTokenDirectSellingPriceResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly price: any;
}
export class VerifyTokenDirectSellingPricesResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly prices: any;
}
export class VerifyTokenInfoForIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly token_info: any;
}
export class VerifyTokenInfosForIdentityIdResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly token_infos: any;
}
export class VerifyTokenInfosForIdentityIdsResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly token_infos: any;
}
export class VerifyTokenPerpetualDistributionLastPaidTimeResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly last_paid_time: any;
}
export class VerifyTokenPreProgrammedDistributionsResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly distributions: any;
}
export class VerifyTokenStatusResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly status: any;
}
export class VerifyTokenStatusesResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly statuses: any;
}
export class VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly total_supply_and_balance: any;
}
export class VerifyTotalCreditsInSystemResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly total_credits: bigint;
}
export class VerifyUpgradeStateResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly upgrade_state: any;
}
export class VerifyUpgradeVoteStatusResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly vote_status: any;
}
export class VerifyVotePollVoteStateProofResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly result: any;
}
export class VerifyVotePollVotesProofResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly votes: Array<any>;
}
export class VerifyVotePollsEndDateQueryResult {
  private constructor();
  free(): void;
  readonly root_hash: Uint8Array;
  readonly vote_polls: any;
}
/**
 * Vote choice for masternode voting
 */
export class VoteChoice {
  private constructor();
  free(): void;
  /**
   * Create a yes vote
   */
  static yes(reason?: string | null): VoteChoice;
  /**
   * Create a no vote
   */
  static no(reason?: string | null): VoteChoice;
  /**
   * Create an abstain vote
   */
  static abstain(reason?: string | null): VoteChoice;
  /**
   * Get vote type as string
   */
  readonly voteType: string;
  /**
   * Get vote reason
   */
  readonly reason: string | undefined;
}
/**
 * Voting poll information
 */
export class VotePoll {
  private constructor();
  free(): void;
  /**
   * Check if poll is active
   */
  isActive(): boolean;
  /**
   * Get remaining time in milliseconds
   */
  getRemainingTime(): bigint;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get poll ID
   */
  readonly id: string;
  /**
   * Get poll title
   */
  readonly title: string;
  /**
   * Get poll description
   */
  readonly description: string;
  /**
   * Get start time
   */
  readonly startTime: bigint;
  /**
   * Get end time
   */
  readonly endTime: bigint;
  /**
   * Get vote options
   */
  readonly voteOptions: Array<any>;
  /**
   * Get required votes
   */
  readonly requiredVotes: number;
  /**
   * Get current votes
   */
  readonly currentVotes: number;
}
/**
 * Vote result information
 */
export class VoteResult {
  private constructor();
  free(): void;
  /**
   * Get vote percentage
   */
  getPercentage(vote_type: string): number;
  /**
   * Convert to JavaScript object
   */
  toObject(): any;
  /**
   * Get poll ID
   */
  readonly pollId: string;
  /**
   * Get yes votes
   */
  readonly yesVotes: number;
  /**
   * Get no votes
   */
  readonly noVotes: number;
  /**
   * Get abstain votes
   */
  readonly abstainVotes: number;
  /**
   * Get total votes
   */
  readonly totalVotes: number;
  /**
   * Check if vote passed
   */
  readonly passed: boolean;
}
/**
 * WASM-exposed cache manager for the SDK
 */
export class WasmCacheManager {
  free(): void;
  /**
   * Create a new cache manager with default TTLs and size limits
   */
  constructor();
  /**
   * Set custom TTLs for each cache type
   */
  setTTLs(contracts_ttl: number, identities_ttl: number, documents_ttl: number, tokens_ttl: number, quorum_keys_ttl: number, metadata_ttl: number): void;
  /**
   * Set custom size limits for each cache type
   */
  setMaxSizes(contracts_max: number, identities_max: number, documents_max: number, tokens_max: number, quorum_keys_max: number, metadata_max: number): void;
  /**
   * Cache a data contract
   */
  cacheContract(contract_id: string, contract_data: Uint8Array): void;
  /**
   * Get a cached data contract
   */
  getCachedContract(contract_id: string): Uint8Array | undefined;
  /**
   * Cache an identity
   */
  cacheIdentity(identity_id: string, identity_data: Uint8Array): void;
  /**
   * Get a cached identity
   */
  getCachedIdentity(identity_id: string): Uint8Array | undefined;
  /**
   * Cache a document
   */
  cacheDocument(document_key: string, document_data: Uint8Array): void;
  /**
   * Get a cached document
   */
  getCachedDocument(document_key: string): Uint8Array | undefined;
  /**
   * Cache token information
   */
  cacheToken(token_id: string, token_data: Uint8Array): void;
  /**
   * Get cached token information
   */
  getCachedToken(token_id: string): Uint8Array | undefined;
  /**
   * Cache quorum keys
   */
  cacheQuorumKeys(epoch: number, keys_data: Uint8Array): void;
  /**
   * Get cached quorum keys
   */
  getCachedQuorumKeys(epoch: number): Uint8Array | undefined;
  /**
   * Cache metadata
   */
  cacheMetadata(key: string, metadata: Uint8Array): void;
  /**
   * Get cached metadata
   */
  getCachedMetadata(key: string): Uint8Array | undefined;
  /**
   * Clear all caches
   */
  clearAll(): void;
  /**
   * Clear a specific cache type
   */
  clearCache(cache_type: string): void;
  /**
   * Remove expired entries from all caches
   */
  cleanupExpired(): void;
  /**
   * Get cache statistics
   */
  getStats(): any;
  /**
   * Start automatic cleanup with specified interval in milliseconds
   */
  startAutoCleanup(interval_ms: number): void;
  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup(): void;
}
export class WasmContext {
  private constructor();
  free(): void;
}
export class WasmError {
  private constructor();
  free(): void;
  /**
   * Get the error category
   */
  readonly category: ErrorCategory;
  /**
   * Get the error message
   */
  readonly message: string;
}
export class WasmSdk {
  private constructor();
  free(): void;
}
export class WasmSdkBuilder {
  private constructor();
  free(): void;
  static new_mainnet(): WasmSdkBuilder;
  static new_testnet(): WasmSdkBuilder;
  build(): WasmSdk;
  with_context_provider(context_provider: WasmContext): WasmSdkBuilder;
}
/**
 * Signer interface for WASM
 */
export class WasmSigner {
  free(): void;
  /**
   * Create a new signer
   */
  constructor();
  /**
   * Set the identity ID for this signer
   */
  setIdentityId(identity_id: string): void;
  /**
   * Add a private key to the signer
   */
  addPrivateKey(public_key_id: number, private_key: Uint8Array, key_type: string, purpose: number): void;
  /**
   * Remove a private key
   */
  removePrivateKey(public_key_id: number): boolean;
  /**
   * Sign data with a specific key
   */
  signData(data: Uint8Array, public_key_id: number): Promise<Uint8Array>;
  /**
   * Get the number of keys in the signer
   */
  getKeyCount(): number;
  /**
   * Check if a key exists
   */
  hasKey(public_key_id: number): boolean;
  /**
   * Get all key IDs
   */
  getKeyIds(): Uint32Array;
}
/**
 * Options for withdrawal operations
 */
export class WithdrawalOptions {
  free(): void;
  constructor();
  /**
   * Set the number of retries
   */
  withRetries(retries: number): WithdrawalOptions;
  /**
   * Set the timeout in milliseconds
   */
  withTimeout(timeout_ms: number): WithdrawalOptions;
  /**
   * Set the fee multiplier
   */
  withFeeMultiplier(multiplier: number): WithdrawalOptions;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_assetlockproof_free: (a: number, b: number) => void;
  readonly assetlockproof_createInstant: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly assetlockproof_createChain: (a: number, b: number, c: number, d: number) => void;
  readonly assetlockproof_proofType: (a: number, b: number) => void;
  readonly assetlockproof_transaction: (a: number, b: number) => void;
  readonly assetlockproof_outputIndex: (a: number) => number;
  readonly assetlockproof_instantLock: (a: number, b: number) => void;
  readonly assetlockproof_coreChainLockedHeight: (a: number) => number;
  readonly assetlockproof_outPoint: (a: number, b: number) => void;
  readonly assetlockproof_toBytes: (a: number, b: number) => void;
  readonly assetlockproof_fromBytes: (a: number, b: number, c: number) => void;
  readonly assetlockproof_toJSON: (a: number, b: number) => void;
  readonly assetlockproof_fromJSON: (a: number, b: number) => void;
  readonly assetlockproof_toObject: (a: number, b: number) => void;
  readonly assetlockproof_getIdentityId: (a: number, b: number) => void;
  readonly validateAssetLockProof: (a: number, b: number, c: number, d: number) => void;
  readonly calculateCreditsFromProof: (a: number, b: number, c: number, d: bigint) => void;
  readonly createOutPoint: (a: number, b: number, c: number, d: number) => void;
  readonly createInstantProofFromParts: (a: number, b: number, c: number, d: number) => void;
  readonly createChainProofFromParts: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_mnemonic_free: (a: number, b: number) => void;
  readonly mnemonic_generate: (a: number, b: number, c: number) => void;
  readonly mnemonic_fromPhrase: (a: number, b: number, c: number, d: number) => void;
  readonly mnemonic_fromEntropy: (a: number, b: number, c: number, d: number) => void;
  readonly mnemonic_phrase: (a: number, b: number) => void;
  readonly mnemonic_words: (a: number) => number;
  readonly mnemonic_wordCount: (a: number) => number;
  readonly mnemonic_entropy: (a: number) => number;
  readonly mnemonic_toSeed: (a: number, b: number, c: number) => number;
  readonly mnemonic_validate: (a: number, b: number, c: number) => number;
  readonly generateMnemonic: (a: number, b: number, c: number) => void;
  readonly validateMnemonic: (a: number, b: number, c: number) => number;
  readonly mnemonicToSeed: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly getWordList: (a: number) => number;
  readonly generateEntropy: (a: number, b: number) => void;
  readonly generateBlsPrivateKey: (a: number) => void;
  readonly blsPrivateKeyToPublicKey: (a: number, b: number, c: number) => void;
  readonly blsSign: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly blsVerify: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly validateBlsPublicKey: (a: number, b: number, c: number) => void;
  readonly blsAggregateSignatures: (a: number, b: number) => void;
  readonly blsCreateThresholdShare: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly getBlsSignatureSize: () => number;
  readonly getBlsPublicKeySize: () => number;
  readonly getBlsPrivateKeySize: () => number;
  readonly __wbg_broadcastoptions_free: (a: number, b: number) => void;
  readonly broadcastoptions_new: () => number;
  readonly broadcastoptions_setWaitForConfirmation: (a: number, b: number) => void;
  readonly broadcastoptions_setRetryCount: (a: number, b: number) => void;
  readonly broadcastoptions_setTimeoutMs: (a: number, b: number) => void;
  readonly broadcastoptions_waitForConfirmation: (a: number) => number;
  readonly broadcastoptions_retryCount: (a: number) => number;
  readonly broadcastoptions_timeoutMs: (a: number) => number;
  readonly __wbg_broadcastresponse_free: (a: number, b: number) => void;
  readonly broadcastresponse_success: (a: number) => number;
  readonly broadcastresponse_transactionId: (a: number, b: number) => void;
  readonly broadcastresponse_blockHeight: (a: number, b: number) => void;
  readonly broadcastresponse_error: (a: number, b: number) => void;
  readonly broadcastresponse_toObject: (a: number, b: number) => void;
  readonly calculateStateTransitionHash: (a: number, b: number) => void;
  readonly validateStateTransition: (a: number, b: number, c: number) => void;
  readonly processBroadcastResponse: (a: number, b: number) => void;
  readonly processWaitForSTResultResponse: (a: number, b: number) => void;
  readonly __wbg_wasmcachemanager_free: (a: number, b: number) => void;
  readonly wasmcachemanager_new: () => number;
  readonly wasmcachemanager_setTTLs: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly wasmcachemanager_setMaxSizes: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly wasmcachemanager_cacheContract: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasmcachemanager_getCachedContract: (a: number, b: number, c: number, d: number) => void;
  readonly wasmcachemanager_cacheIdentity: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasmcachemanager_getCachedIdentity: (a: number, b: number, c: number, d: number) => void;
  readonly wasmcachemanager_cacheDocument: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasmcachemanager_getCachedDocument: (a: number, b: number, c: number, d: number) => void;
  readonly wasmcachemanager_cacheToken: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasmcachemanager_getCachedToken: (a: number, b: number, c: number, d: number) => void;
  readonly wasmcachemanager_cacheQuorumKeys: (a: number, b: number, c: number, d: number) => void;
  readonly wasmcachemanager_getCachedQuorumKeys: (a: number, b: number, c: number) => void;
  readonly wasmcachemanager_cacheMetadata: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wasmcachemanager_getCachedMetadata: (a: number, b: number, c: number, d: number) => void;
  readonly wasmcachemanager_clearAll: (a: number) => void;
  readonly wasmcachemanager_clearCache: (a: number, b: number, c: number) => void;
  readonly wasmcachemanager_cleanupExpired: (a: number) => void;
  readonly wasmcachemanager_getStats: (a: number, b: number) => void;
  readonly wasmcachemanager_startAutoCleanup: (a: number, b: number) => void;
  readonly wasmcachemanager_stopAutoCleanup: (a: number) => void;
  readonly __wbg_wasmcontext_free: (a: number, b: number) => void;
  readonly __wbg_contractcacheconfig_free: (a: number, b: number) => void;
  readonly contractcacheconfig_new: () => number;
  readonly contractcacheconfig_setMaxContracts: (a: number, b: number) => void;
  readonly contractcacheconfig_setTtl: (a: number, b: number) => void;
  readonly contractcacheconfig_setCacheHistory: (a: number, b: number) => void;
  readonly contractcacheconfig_setMaxVersionsPerContract: (a: number, b: number) => void;
  readonly contractcacheconfig_setEnablePreloading: (a: number, b: number) => void;
  readonly __wbg_contractcache_free: (a: number, b: number) => void;
  readonly contractcache_new: (a: number) => number;
  readonly contractcache_cacheContract: (a: number, b: number, c: number, d: number) => void;
  readonly contractcache_getCachedContract: (a: number, b: number, c: number, d: number) => void;
  readonly contractcache_getContractMetadata: (a: number, b: number, c: number, d: number) => void;
  readonly contractcache_isContractCached: (a: number, b: number, c: number) => number;
  readonly contractcache_getCachedContractIds: (a: number) => number;
  readonly contractcache_getCacheStats: (a: number, b: number) => void;
  readonly contractcache_clearCache: (a: number) => void;
  readonly contractcache_cleanupExpired: (a: number) => number;
  readonly contractcache_getPreloadSuggestions: (a: number) => number;
  readonly createContractCache: (a: number) => number;
  readonly integrateContractCache: (a: number, b: number, c: number) => void;
  readonly __wbg_contractversion_free: (a: number, b: number) => void;
  readonly contractversion_version: (a: number) => number;
  readonly contractversion_schemaHash: (a: number, b: number) => void;
  readonly contractversion_ownerId: (a: number, b: number) => void;
  readonly contractversion_createdAt: (a: number) => bigint;
  readonly contractversion_documentTypesCount: (a: number) => number;
  readonly contractversion_totalDocuments: (a: number) => bigint;
  readonly contractversion_toObject: (a: number, b: number) => void;
  readonly __wbg_contracthistoryentry_free: (a: number, b: number) => void;
  readonly contracthistoryentry_contractId: (a: number, b: number) => void;
  readonly contracthistoryentry_version: (a: number) => number;
  readonly contracthistoryentry_operation: (a: number, b: number) => void;
  readonly contracthistoryentry_timestamp: (a: number) => bigint;
  readonly contracthistoryentry_changes: (a: number) => number;
  readonly contracthistoryentry_transactionHash: (a: number, b: number) => void;
  readonly contracthistoryentry_toObject: (a: number, b: number) => void;
  readonly __wbg_schemachange_free: (a: number, b: number) => void;
  readonly schemachange_documentType: (a: number, b: number) => void;
  readonly schemachange_changeType: (a: number, b: number) => void;
  readonly schemachange_fieldName: (a: number, b: number) => void;
  readonly schemachange_oldValue: (a: number, b: number) => void;
  readonly schemachange_newValue: (a: number, b: number) => void;
  readonly fetchContractHistory: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly fetchContractVersions: (a: number, b: number, c: number) => number;
  readonly getSchemaChanges: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly fetchContractAtVersion: (a: number, b: number, c: number, d: number) => number;
  readonly checkContractUpdates: (a: number, b: number, c: number, d: number) => number;
  readonly getMigrationGuide: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly monitorContractUpdates: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbg_dapiclientconfig_free: (a: number, b: number) => void;
  readonly dapiclientconfig_new: (a: number, b: number) => number;
  readonly dapiclientconfig_addEndpoint: (a: number, b: number, c: number) => void;
  readonly dapiclientconfig_setTimeout: (a: number, b: number) => void;
  readonly dapiclientconfig_setRetries: (a: number, b: number) => void;
  readonly dapiclientconfig_endpoints: (a: number) => number;
  readonly __wbg_dapiclient_free: (a: number, b: number) => void;
  readonly dapiclient_new: (a: number, b: number) => void;
  readonly dapiclient_network: (a: number, b: number) => void;
  readonly dapiclient_getCurrentEndpoint: (a: number, b: number) => void;
  readonly dapiclient_broadcastStateTransition: (a: number, b: number, c: number, d: number) => number;
  readonly dapiclient_getIdentity: (a: number, b: number, c: number, d: number) => number;
  readonly dapiclient_getDataContract: (a: number, b: number, c: number, d: number) => number;
  readonly dapiclient_getDocuments: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
  readonly dapiclient_getEpochInfo: (a: number, b: number, c: number) => number;
  readonly dapiclient_subscribeToStateTransitions: (a: number, b: number, c: number) => number;
  readonly dapiclient_getProtocolVersion: (a: number) => number;
  readonly dapiclient_waitForStateTransitionResult: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_identitywasm_free: (a: number, b: number) => void;
  readonly identitywasm_new: (a: number, b: number) => void;
  readonly identitywasm_id: (a: number, b: number) => void;
  readonly identitywasm_revision: (a: number) => bigint;
  readonly identitywasm_setPublicKeys: (a: number, b: number, c: number) => void;
  readonly identitywasm_balance: (a: number) => number;
  readonly identitywasm_setBalance: (a: number, b: number) => void;
  readonly identitywasm_increaseBalance: (a: number, b: number) => number;
  readonly identitywasm_reduceBalance: (a: number, b: number) => number;
  readonly identitywasm_setRevision: (a: number, b: number) => void;
  readonly identitywasm_getRevision: (a: number) => number;
  readonly identitywasm_toJSON: (a: number, b: number) => void;
  readonly identitywasm_hash: (a: number, b: number) => void;
  readonly identitywasm_getPublicKeyMaxId: (a: number) => number;
  readonly identitywasm_fromBuffer: (a: number, b: number, c: number) => void;
  readonly __wbg_datacontractwasm_free: (a: number, b: number) => void;
  readonly datacontractwasm_id: (a: number, b: number) => void;
  readonly datacontractwasm_version: (a: number) => number;
  readonly datacontractwasm_ownerId: (a: number, b: number) => void;
  readonly datacontractwasm_toJSON: (a: number, b: number) => void;
  readonly __wbg_epoch_free: (a: number, b: number) => void;
  readonly epoch_index: (a: number) => number;
  readonly epoch_startBlockHeight: (a: number) => bigint;
  readonly epoch_startBlockCoreHeight: (a: number) => number;
  readonly epoch_startTimeMs: (a: number) => bigint;
  readonly epoch_feeMultiplier: (a: number) => number;
  readonly epoch_toObject: (a: number, b: number) => void;
  readonly __wbg_evonode_free: (a: number, b: number) => void;
  readonly evonode_proTxHash: (a: number, b: number) => void;
  readonly evonode_ownerAddress: (a: number, b: number) => void;
  readonly evonode_votingAddress: (a: number, b: number) => void;
  readonly evonode_isHPMN: (a: number) => number;
  readonly evonode_platformP2PPort: (a: number) => number;
  readonly evonode_platformHTTPPort: (a: number) => number;
  readonly evonode_nodeIP: (a: number, b: number) => void;
  readonly evonode_toObject: (a: number, b: number) => void;
  readonly getCurrentEpoch: (a: number) => number;
  readonly getEpochByIndex: (a: number, b: number) => number;
  readonly getCurrentEvonodes: (a: number) => number;
  readonly getEvonodesForEpoch: (a: number, b: number) => number;
  readonly getEvonodeByProTxHash: (a: number, b: number, c: number) => number;
  readonly getCurrentQuorum: (a: number) => number;
  readonly calculateEpochBlocks: (a: number, b: number, c: number) => void;
  readonly estimateNextEpochTime: (a: number, b: bigint) => number;
  readonly getEpochForBlockHeight: (a: number, b: bigint) => number;
  readonly getValidatorSetChanges: (a: number, b: number, c: number) => number;
  readonly getEpochStats: (a: number, b: number) => number;
  readonly __wbg_wasmerror_free: (a: number, b: number) => void;
  readonly wasmerror_category: (a: number) => number;
  readonly wasmerror_message: (a: number, b: number) => void;
  readonly __wbg_fetchoptions_free: (a: number, b: number) => void;
  readonly __wbg_get_fetchoptions_retries: (a: number) => number;
  readonly __wbg_set_fetchoptions_retries: (a: number, b: number) => void;
  readonly __wbg_get_fetchoptions_timeout: (a: number) => number;
  readonly __wbg_set_fetchoptions_timeout: (a: number, b: number) => void;
  readonly __wbg_get_fetchoptions_prove: (a: number) => number;
  readonly __wbg_set_fetchoptions_prove: (a: number, b: number) => void;
  readonly fetchoptions_new: () => number;
  readonly fetchoptions_withRetries: (a: number, b: number) => number;
  readonly fetchoptions_withTimeout: (a: number, b: number) => number;
  readonly fetchoptions_withProve: (a: number, b: number) => number;
  readonly fetchIdentity: (a: number, b: number, c: number, d: number) => number;
  readonly fetchDataContract: (a: number, b: number, c: number, d: number) => number;
  readonly fetchDocument: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly fetchIdentityBalance: (a: number, b: number, c: number, d: number) => number;
  readonly fetchIdentityNonce: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbg_fetchmanyoptions_free: (a: number, b: number) => void;
  readonly fetchmanyoptions_new: () => number;
  readonly fetchmanyoptions_setProve: (a: number, b: number) => void;
  readonly __wbg_fetchmanyresponse_free: (a: number, b: number) => void;
  readonly fetchmanyresponse_items: (a: number) => number;
  readonly fetchmanyresponse_metadata: (a: number) => number;
  readonly fetch_identities: (a: number, b: number, c: number, d: number) => number;
  readonly fetch_data_contracts: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_documentqueryoptions_free: (a: number, b: number) => void;
  readonly documentqueryoptions_new: (a: number, b: number, c: number, d: number) => number;
  readonly documentqueryoptions_setWhereClause: (a: number, b: number) => void;
  readonly documentqueryoptions_setOrderBy: (a: number, b: number) => void;
  readonly documentqueryoptions_setLimit: (a: number, b: number) => void;
  readonly documentqueryoptions_setStartAt: (a: number, b: number, c: number) => void;
  readonly documentqueryoptions_setStartAfter: (a: number, b: number, c: number) => void;
  readonly fetch_documents: (a: number, b: number, c: number) => number;
  readonly fetchIdentityUnproved: (a: number, b: number, c: number, d: number) => number;
  readonly fetchDataContractUnproved: (a: number, b: number, c: number, d: number) => number;
  readonly fetchDocumentsUnproved: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
  readonly fetchIdentityByKeyUnproved: (a: number, b: number, c: number, d: number) => number;
  readonly fetchDataContractHistoryUnproved: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly fetchBatchUnproved: (a: number, b: number, c: number) => number;
  readonly __wbg_group_free: (a: number, b: number) => void;
  readonly group_id: (a: number, b: number) => void;
  readonly group_name: (a: number, b: number) => void;
  readonly group_description: (a: number, b: number) => void;
  readonly group_groupType: (a: number, b: number) => void;
  readonly group_createdAt: (a: number) => bigint;
  readonly group_memberCount: (a: number) => number;
  readonly group_threshold: (a: number) => number;
  readonly group_active: (a: number) => number;
  readonly group_toObject: (a: number, b: number) => void;
  readonly __wbg_groupmember_free: (a: number, b: number) => void;
  readonly groupmember_identityId: (a: number, b: number) => void;
  readonly groupmember_role: (a: number, b: number) => void;
  readonly groupmember_joinedAt: (a: number) => bigint;
  readonly groupmember_permissions: (a: number) => number;
  readonly groupmember_hasPermission: (a: number, b: number, c: number) => number;
  readonly __wbg_groupproposal_free: (a: number, b: number) => void;
  readonly groupproposal_id: (a: number, b: number) => void;
  readonly groupproposal_groupId: (a: number, b: number) => void;
  readonly groupproposal_proposerId: (a: number, b: number) => void;
  readonly groupproposal_title: (a: number, b: number) => void;
  readonly groupproposal_description: (a: number, b: number) => void;
  readonly groupproposal_actionType: (a: number, b: number) => void;
  readonly groupproposal_actionData: (a: number, b: number) => void;
  readonly groupproposal_createdAt: (a: number) => bigint;
  readonly groupproposal_expiresAt: (a: number) => bigint;
  readonly groupproposal_approvals: (a: number) => number;
  readonly groupproposal_rejections: (a: number) => number;
  readonly groupproposal_executed: (a: number) => number;
  readonly groupproposal_isActive: (a: number) => number;
  readonly groupproposal_isExpired: (a: number) => number;
  readonly groupproposal_toObject: (a: number, b: number) => void;
  readonly createGroup: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: bigint, m: number) => void;
  readonly addGroupMember: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: bigint, l: number) => void;
  readonly removeGroupMember: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: bigint, i: number) => void;
  readonly createGroupProposal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: bigint, p: number) => void;
  readonly voteOnProposal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: bigint, j: number) => void;
  readonly executeProposal: (a: number, b: number, c: number, d: number, e: number, f: bigint, g: number) => void;
  readonly fetchGroup: (a: number, b: number, c: number) => number;
  readonly fetchGroupMembers: (a: number, b: number, c: number) => number;
  readonly fetchGroupProposals: (a: number, b: number, c: number, d: number) => number;
  readonly fetchUserGroups: (a: number, b: number, c: number) => number;
  readonly checkGroupPermission: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly __wbg_identitybalance_free: (a: number, b: number) => void;
  readonly identitybalance_confirmed: (a: number) => bigint;
  readonly identitybalance_unconfirmed: (a: number) => bigint;
  readonly identitybalance_total: (a: number) => bigint;
  readonly identitybalance_toObject: (a: number, b: number) => void;
  readonly identityrevision_publicKeysCount: (a: number) => number;
  readonly identityrevision_toObject: (a: number, b: number) => void;
  readonly __wbg_identityinfo_free: (a: number, b: number) => void;
  readonly identityinfo_id: (a: number, b: number) => void;
  readonly identityinfo_balance: (a: number) => number;
  readonly identityinfo_revision: (a: number) => number;
  readonly identityinfo_toObject: (a: number, b: number) => void;
  readonly fetchIdentityBalanceDetails: (a: number, b: number, c: number) => number;
  readonly fetchIdentityRevision: (a: number, b: number, c: number) => number;
  readonly fetchIdentityInfo: (a: number, b: number, c: number) => number;
  readonly fetchIdentityBalanceHistory: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly checkIdentityBalance: (a: number, b: number, c: number, d: bigint, e: number) => number;
  readonly estimateCreditsNeeded: (a: number, b: number, c: number, d: number) => void;
  readonly monitorIdentityBalance: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly fetchIdentityKeys: (a: number, b: number, c: number) => number;
  readonly fetchIdentityCreditsInDash: (a: number, b: number, c: number) => number;
  readonly batchFetchIdentityInfo: (a: number, b: number, c: number) => number;
  readonly estimateCreditTransferFee: (a: number, b: bigint, c: number, d: number) => void;
  readonly __wbg_metadata_free: (a: number, b: number) => void;
  readonly metadata_new: (a: bigint, b: number, c: number, d: bigint, e: number, f: number, g: number) => number;
  readonly metadata_height: (a: number) => bigint;
  readonly metadata_coreChainLockedHeight: (a: number) => number;
  readonly metadata_epoch: (a: number) => number;
  readonly metadata_timeMs: (a: number) => bigint;
  readonly metadata_protocolVersion: (a: number) => number;
  readonly metadata_chainId: (a: number, b: number) => void;
  readonly metadata_toObject: (a: number, b: number) => void;
  readonly __wbg_metadataverificationconfig_free: (a: number, b: number) => void;
  readonly metadataverificationconfig_new: () => number;
  readonly metadataverificationconfig_setMaxHeightDifference: (a: number, b: bigint) => void;
  readonly metadataverificationconfig_setMaxTimeDifference: (a: number, b: bigint) => void;
  readonly metadataverificationconfig_setVerifyTime: (a: number, b: number) => void;
  readonly metadataverificationconfig_setVerifyHeight: (a: number, b: number) => void;
  readonly metadataverificationconfig_setVerifyChainId: (a: number, b: number) => void;
  readonly metadataverificationconfig_setExpectedChainId: (a: number, b: number, c: number) => void;
  readonly __wbg_metadataverificationresult_free: (a: number, b: number) => void;
  readonly metadataverificationresult_valid: (a: number) => number;
  readonly metadataverificationresult_heightValid: (a: number) => number;
  readonly metadataverificationresult_timeValid: (a: number) => number;
  readonly metadataverificationresult_chainIdValid: (a: number) => number;
  readonly metadataverificationresult_heightDifference: (a: number, b: number) => void;
  readonly metadataverificationresult_timeDifferenceMs: (a: number, b: number) => void;
  readonly metadataverificationresult_errorMessage: (a: number, b: number) => void;
  readonly metadataverificationresult_toObject: (a: number, b: number) => void;
  readonly verifyMetadata: (a: number, b: bigint, c: number, d: number, e: number) => number;
  readonly compareMetadata: (a: number, b: number) => number;
  readonly getMostRecentMetadata: (a: number, b: number, c: number) => void;
  readonly isMetadataStale: (a: number, b: bigint, c: bigint, d: number, e: bigint) => number;
  readonly __wbg_performancemetrics_free: (a: number, b: number) => void;
  readonly performancemetrics_operation: (a: number, b: number) => void;
  readonly performancemetrics_duration: (a: number, b: number) => void;
  readonly performancemetrics_success: (a: number) => number;
  readonly performancemetrics_errorMessage: (a: number, b: number) => void;
  readonly performancemetrics_toObject: (a: number, b: number) => void;
  readonly __wbg_sdkmonitor_free: (a: number, b: number) => void;
  readonly sdkmonitor_new: (a: number, b: number) => number;
  readonly sdkmonitor_enabled: (a: number) => number;
  readonly sdkmonitor_enable: (a: number) => void;
  readonly sdkmonitor_disable: (a: number) => void;
  readonly sdkmonitor_startOperation: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly sdkmonitor_endOperation: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly sdkmonitor_addOperationMetadata: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly sdkmonitor_getMetrics: (a: number, b: number) => void;
  readonly sdkmonitor_getMetricsByOperation: (a: number, b: number, c: number, d: number) => void;
  readonly sdkmonitor_getOperationStats: (a: number, b: number) => void;
  readonly sdkmonitor_clearMetrics: (a: number, b: number) => void;
  readonly sdkmonitor_getActiveOperationsCount: (a: number, b: number) => void;
  readonly initializeMonitoring: (a: number, b: number, c: number) => void;
  readonly isGlobalMonitorEnabled: (a: number) => void;
  readonly trackOperation: (a: number, b: number, c: number) => number;
  readonly __wbg_healthcheckresult_free: (a: number, b: number) => void;
  readonly healthcheckresult_status: (a: number, b: number) => void;
  readonly healthcheckresult_checks: (a: number) => number;
  readonly healthcheckresult_timestamp: (a: number) => number;
  readonly performHealthCheck: (a: number) => number;
  readonly getResourceUsage: (a: number) => void;
  readonly __wbg_nonceoptions_free: (a: number, b: number) => void;
  readonly nonceoptions_new: () => number;
  readonly nonceoptions_setCached: (a: number, b: number) => void;
  readonly nonceoptions_setProve: (a: number, b: number) => void;
  readonly __wbg_nonceresponse_free: (a: number, b: number) => void;
  readonly nonceresponse_nonce: (a: number) => bigint;
  readonly nonceresponse_metadata: (a: number) => number;
  readonly checkIdentityNonceCache: (a: number, b: number, c: number) => void;
  readonly updateIdentityNonceCache: (a: number, b: number, c: number, d: bigint) => void;
  readonly checkIdentityContractNonceCache: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly updateIdentityContractNonceCache: (a: number, b: number, c: number, d: number, e: number, f: bigint) => void;
  readonly incrementIdentityNonceCache: (a: number, b: number, c: number, d: number) => void;
  readonly incrementIdentityContractNonceCache: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly clearIdentityNonceCache: (a: number) => void;
  readonly clearIdentityContractNonceCache: (a: number) => void;
  readonly __wbg_featureflags_free: (a: number, b: number) => void;
  readonly featureflags_new: () => number;
  readonly featureflags_minimal: () => number;
  readonly featureflags_setEnableIdentity: (a: number, b: number) => void;
  readonly featureflags_setEnableContracts: (a: number, b: number) => void;
  readonly featureflags_setEnableDocuments: (a: number, b: number) => void;
  readonly featureflags_setEnableTokens: (a: number, b: number) => void;
  readonly featureflags_setEnableWithdrawals: (a: number, b: number) => void;
  readonly featureflags_setEnableVoting: (a: number, b: number) => void;
  readonly featureflags_setEnableCache: (a: number, b: number) => void;
  readonly featureflags_setEnableProofVerification: (a: number, b: number) => void;
  readonly featureflags_getEstimatedSizeReduction: (a: number, b: number) => void;
  readonly memoryoptimizer_new: () => number;
  readonly memoryoptimizer_trackAllocation: (a: number, b: number) => void;
  readonly memoryoptimizer_getStats: (a: number, b: number) => void;
  readonly memoryoptimizer_reset: (a: number) => void;
  readonly memoryoptimizer_forceGC: () => void;
  readonly optimizeUint8Array: (a: number, b: number) => number;
  readonly __wbg_batchoptimizer_free: (a: number, b: number) => void;
  readonly batchoptimizer_new: () => number;
  readonly batchoptimizer_setBatchSize: (a: number, b: number) => void;
  readonly batchoptimizer_setMaxConcurrent: (a: number, b: number) => void;
  readonly batchoptimizer_getOptimalBatchCount: (a: number, b: number) => number;
  readonly batchoptimizer_getBatchBoundaries: (a: number, b: number, c: number) => number;
  readonly initStringCache: () => void;
  readonly internString: (a: number, b: number, c: number) => void;
  readonly clearStringCache: () => void;
  readonly __wbg_compressionutils_free: (a: number, b: number) => void;
  readonly compressionutils_shouldCompress: (a: number) => number;
  readonly compressionutils_estimateCompressionRatio: (a: number, b: number) => number;
  readonly __wbg_performancemonitor_free: (a: number, b: number) => void;
  readonly performancemonitor_new: () => number;
  readonly performancemonitor_mark: (a: number, b: number, c: number) => void;
  readonly performancemonitor_getReport: (a: number, b: number) => void;
  readonly performancemonitor_reset: (a: number) => void;
  readonly getOptimizationRecommendations: () => number;
  readonly __wbg_prefundedbalance_free: (a: number, b: number) => void;
  readonly prefundedbalance_balanceType: (a: number, b: number) => void;
  readonly prefundedbalance_amount: (a: number) => bigint;
  readonly prefundedbalance_lockedUntil: (a: number, b: number) => void;
  readonly prefundedbalance_purpose: (a: number, b: number) => void;
  readonly prefundedbalance_canWithdraw: (a: number) => number;
  readonly prefundedbalance_isLocked: (a: number) => number;
  readonly prefundedbalance_getRemainingLockTime: (a: number) => bigint;
  readonly prefundedbalance_toObject: (a: number, b: number) => void;
  readonly __wbg_balanceallocation_free: (a: number, b: number) => void;
  readonly balanceallocation_identityId: (a: number, b: number) => void;
  readonly balanceallocation_balanceType: (a: number, b: number) => void;
  readonly balanceallocation_allocatedAmount: (a: number) => bigint;
  readonly balanceallocation_usedAmount: (a: number) => bigint;
  readonly balanceallocation_getAvailableAmount: (a: number) => bigint;
  readonly balanceallocation_allocatedAt: (a: number) => bigint;
  readonly balanceallocation_expiresAt: (a: number, b: number) => void;
  readonly balanceallocation_isExpired: (a: number) => number;
  readonly balanceallocation_toObject: (a: number, b: number) => void;
  readonly createPrefundedBalance: (a: number, b: number, c: number, d: number, e: number, f: bigint, g: number, h: number, i: number, j: number, k: bigint, l: number) => void;
  readonly transferPrefundedBalance: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: bigint, i: bigint, j: number) => void;
  readonly usePrefundedBalance: (a: number, b: number, c: number, d: number, e: number, f: bigint, g: number, h: number, i: bigint, j: number) => void;
  readonly releasePrefundedBalance: (a: number, b: number, c: number, d: number, e: number, f: bigint, g: number) => void;
  readonly fetchPrefundedBalances: (a: number, b: number, c: number) => number;
  readonly getPrefundedBalance: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly checkPrefundedBalance: (a: number, b: number, c: number, d: number, e: number, f: bigint) => number;
  readonly fetchBalanceAllocations: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly monitorPrefundedBalance: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly __wbg_identifierquery_free: (a: number, b: number) => void;
  readonly identifierquery_new: (a: number, b: number, c: number) => void;
  readonly identifierquery_id: (a: number, b: number) => void;
  readonly __wbg_identifiersquery_free: (a: number, b: number) => void;
  readonly identifiersquery_new: (a: number, b: number, c: number) => void;
  readonly identifiersquery_ids: (a: number, b: number) => void;
  readonly identifiersquery_count: (a: number) => number;
  readonly __wbg_limitquery_free: (a: number, b: number) => void;
  readonly limitquery_new: () => number;
  readonly limitquery_set_limit: (a: number, b: number) => void;
  readonly limitquery_set_offset: (a: number, b: number) => void;
  readonly limitquery_set_setStartKey: (a: number, b: number, c: number) => void;
  readonly limitquery_set_setStartIncluded: (a: number, b: number) => void;
  readonly limitquery_limit: (a: number) => number;
  readonly limitquery_offset: (a: number) => number;
  readonly __wbg_documentquery_free: (a: number, b: number) => void;
  readonly documentquery_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly documentquery_addWhereClause: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly documentquery_addOrderBy: (a: number, b: number, c: number, d: number) => void;
  readonly documentquery_set_limit: (a: number, b: number) => void;
  readonly documentquery_set_offset: (a: number, b: number) => void;
  readonly documentquery_contractId: (a: number, b: number) => void;
  readonly documentquery_documentType: (a: number, b: number) => void;
  readonly documentquery_limit: (a: number) => number;
  readonly documentquery_offset: (a: number) => number;
  readonly documentquery_getWhereClauses: (a: number, b: number) => void;
  readonly documentquery_getOrderByClauses: (a: number, b: number) => void;
  readonly __wbg_epochquery_free: (a: number, b: number) => void;
  readonly epochquery_new: () => number;
  readonly epochquery_set_setStartEpoch: (a: number, b: number) => void;
  readonly epochquery_set_count: (a: number, b: number) => void;
  readonly epochquery_set_ascending: (a: number, b: number) => void;
  readonly epochquery_startEpoch: (a: number) => number;
  readonly epochquery_count: (a: number) => number;
  readonly epochquery_ascending: (a: number) => number;
  readonly __wbg_contestedresourcequery_free: (a: number, b: number) => void;
  readonly contestedresourcequery_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly contestedresourcequery_set_setStartValue: (a: number, b: number, c: number) => void;
  readonly contestedresourcequery_set_setStartIncluded: (a: number, b: number) => void;
  readonly contestedresourcequery_set_limit: (a: number, b: number) => void;
  readonly __wbg_requestsettings_free: (a: number, b: number) => void;
  readonly requestsettings_new: () => number;
  readonly requestsettings_setMaxRetries: (a: number, b: number) => void;
  readonly requestsettings_setInitialRetryDelay: (a: number, b: number) => void;
  readonly requestsettings_setMaxRetryDelay: (a: number, b: number) => void;
  readonly requestsettings_setBackoffMultiplier: (a: number, b: number) => void;
  readonly requestsettings_setTimeout: (a: number, b: number) => void;
  readonly requestsettings_setUseExponentialBackoff: (a: number, b: number) => void;
  readonly requestsettings_setRetryOnTimeout: (a: number, b: number) => void;
  readonly requestsettings_setRetryOnNetworkError: (a: number, b: number) => void;
  readonly requestsettings_setCustomHeaders: (a: number, b: number) => void;
  readonly requestsettings_getRetryDelay: (a: number, b: number) => number;
  readonly requestsettings_toObject: (a: number, b: number) => void;
  readonly __wbg_retryhandler_free: (a: number, b: number) => void;
  readonly retryhandler_new: (a: number) => number;
  readonly retryhandler_shouldRetry: (a: number, b: number) => number;
  readonly retryhandler_getNextRetryDelay: (a: number) => number;
  readonly retryhandler_incrementAttempt: (a: number) => void;
  readonly retryhandler_currentAttempt: (a: number) => number;
  readonly retryhandler_getElapsedTime: (a: number) => number;
  readonly retryhandler_isTimeoutExceeded: (a: number) => number;
  readonly executeWithRetry: (a: number, b: number) => number;
  readonly __wbg_requestsettingsbuilder_free: (a: number, b: number) => void;
  readonly requestsettingsbuilder_new: () => number;
  readonly requestsettingsbuilder_withMaxRetries: (a: number, b: number) => number;
  readonly requestsettingsbuilder_withTimeout: (a: number, b: number) => number;
  readonly requestsettingsbuilder_withInitialRetryDelay: (a: number, b: number) => number;
  readonly requestsettingsbuilder_withBackoffMultiplier: (a: number, b: number) => number;
  readonly requestsettingsbuilder_withoutRetries: (a: number) => number;
  readonly requestsettingsbuilder_build: (a: number) => number;
  readonly __wbg_wasmsdk_free: (a: number, b: number) => void;
  readonly __wbg_wasmsdkbuilder_free: (a: number, b: number) => void;
  readonly wasmsdkbuilder_new_mainnet: () => number;
  readonly wasmsdkbuilder_build: (a: number, b: number) => void;
  readonly wasmsdkbuilder_with_context_provider: (a: number, b: number) => number;
  readonly prepare_identity_fetch_request: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly serializeGetIdentityRequest: (a: number, b: number, c: number, d: number) => void;
  readonly deserializeGetIdentityResponse: (a: number, b: number) => void;
  readonly serializeGetDataContractRequest: (a: number, b: number, c: number, d: number) => void;
  readonly deserializeGetDataContractResponse: (a: number, b: number) => void;
  readonly serializeBroadcastRequest: (a: number, b: number) => void;
  readonly deserializeBroadcastResponse: (a: number, b: number) => void;
  readonly serializeGetIdentityNonceRequest: (a: number, b: number, c: number, d: number) => void;
  readonly deserializeGetIdentityNonceResponse: (a: number, b: number) => void;
  readonly serializeWaitForStateTransitionRequest: (a: number, b: number, c: number, d: number) => void;
  readonly deserializeWaitForStateTransitionResponse: (a: number, b: number) => void;
  readonly serializeDocumentQuery: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly deserializeDocumentQueryResponse: (a: number, b: number) => void;
  readonly prepareStateTransitionForBroadcast: (a: number, b: number) => void;
  readonly getRequiredSignaturesForStateTransition: (a: number, b: number) => void;
  readonly __wbg_wasmsigner_free: (a: number, b: number) => void;
  readonly wasmsigner_new: () => number;
  readonly wasmsigner_setIdentityId: (a: number, b: number, c: number, d: number) => void;
  readonly wasmsigner_addPrivateKey: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly wasmsigner_removePrivateKey: (a: number, b: number) => number;
  readonly wasmsigner_signData: (a: number, b: number, c: number, d: number) => number;
  readonly wasmsigner_getKeyCount: (a: number) => number;
  readonly wasmsigner_hasKey: (a: number, b: number) => number;
  readonly wasmsigner_getKeyIds: (a: number, b: number) => void;
  readonly __wbg_browsersigner_free: (a: number, b: number) => void;
  readonly browsersigner_new: () => number;
  readonly browsersigner_generateKeyPair: (a: number, b: number, c: number, d: number) => number;
  readonly browsersigner_signWithStoredKey: (a: number, b: number, c: number, d: number) => number;
  readonly hdsigner_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly hdsigner_generateMnemonic: (a: number, b: number) => void;
  readonly hdsigner_deriveKey: (a: number, b: number, c: number) => void;
  readonly create_data_contract: (a: number, b: number, c: number, d: number, e: bigint, f: number) => void;
  readonly update_data_contract: (a: number, b: number, c: number, d: number, e: number, f: number, g: bigint, h: number) => void;
  readonly __wbg_datacontracttransitionbuilder_free: (a: number, b: number) => void;
  readonly datacontracttransitionbuilder_new: (a: number, b: number, c: number) => void;
  readonly datacontracttransitionbuilder_setContractId: (a: number, b: number, c: number, d: number) => void;
  readonly datacontracttransitionbuilder_setVersion: (a: number, b: number) => void;
  readonly datacontracttransitionbuilder_setUserFeeIncrease: (a: number, b: number) => void;
  readonly datacontracttransitionbuilder_setIdentityNonce: (a: number, b: bigint) => void;
  readonly datacontracttransitionbuilder_setIdentityContractNonce: (a: number, b: bigint) => void;
  readonly datacontracttransitionbuilder_addDocumentSchema: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly datacontracttransitionbuilder_setContractDefinition: (a: number, b: number, c: number) => void;
  readonly datacontracttransitionbuilder_buildCreateTransition: (a: number, b: number, c: number) => void;
  readonly datacontracttransitionbuilder_buildUpdateTransition: (a: number, b: number, c: number) => void;
  readonly create_document_batch_transition: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_documentbatchbuilder_free: (a: number, b: number) => void;
  readonly documentbatchbuilder_new: (a: number, b: number, c: number) => void;
  readonly documentbatchbuilder_setUserFeeIncrease: (a: number, b: number) => void;
  readonly documentbatchbuilder_addCreateDocument: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly documentbatchbuilder_addDeleteDocument: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly documentbatchbuilder_addReplaceDocument: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly documentbatchbuilder_build: (a: number, b: number, c: number) => void;
  readonly createGroupStateTransitionInfo: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly createTokenEventBytes: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly createGroupAction: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly addGroupInfoToStateTransition: (a: number, b: number, c: number, d: number) => void;
  readonly getGroupInfoFromStateTransition: (a: number, b: number, c: number) => void;
  readonly createGroupMember: (a: number, b: number, c: number, d: number) => void;
  readonly validateGroupConfig: (a: number, b: number, c: number, d: number) => void;
  readonly calculateGroupActionApproval: (a: number, b: number, c: number) => void;
  readonly createGroupConfiguration: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly deserializeGroupEvent: (a: number, b: number, c: number) => void;
  readonly serializeGroupEvent: (a: number, b: number) => void;
  readonly createIdentity: (a: number, b: number, c: number, d: number) => void;
  readonly topUpIdentity: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly update_identity: (a: number, b: number, c: number, d: bigint, e: bigint, f: number, g: number, h: number, i: bigint, j: number) => void;
  readonly __wbg_identitytransitionbuilder_free: (a: number, b: number) => void;
  readonly identitytransitionbuilder_new: () => number;
  readonly identitytransitionbuilder_setIdentityId: (a: number, b: number, c: number, d: number) => void;
  readonly identitytransitionbuilder_setRevision: (a: number, b: bigint) => void;
  readonly identitytransitionbuilder_addPublicKey: (a: number, b: number, c: number) => void;
  readonly identitytransitionbuilder_addPublicKeys: (a: number, b: number, c: number) => void;
  readonly identitytransitionbuilder_disablePublicKey: (a: number, b: number, c: number) => void;
  readonly identitytransitionbuilder_disablePublicKeys: (a: number, b: number, c: number) => void;
  readonly identitytransitionbuilder_buildCreateTransition: (a: number, b: number, c: number, d: number) => void;
  readonly identitytransitionbuilder_buildTopUpTransition: (a: number, b: number, c: number, d: number) => void;
  readonly identitytransitionbuilder_buildUpdateTransition: (a: number, b: number, c: bigint, d: number, e: number, f: bigint) => void;
  readonly createBasicIdentity: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly createStandardIdentityKeys: (a: number) => void;
  readonly validateIdentityPublicKeys: (a: number, b: number) => void;
  readonly serializeStateTransition: (a: number, b: number) => void;
  readonly deserializeStateTransition: (a: number, b: number) => void;
  readonly getStateTransitionType: (a: number, b: number) => void;
  readonly calculateStateTransitionId: (a: number, b: number) => void;
  readonly validateStateTransitionStructure: (a: number, b: number) => void;
  readonly isIdentitySignedStateTransition: (a: number, b: number) => void;
  readonly getStateTransitionIdentityId: (a: number, b: number) => void;
  readonly getModifiedDataIds: (a: number, b: number) => void;
  readonly getStateTransitionSignableBytes: (a: number, b: number) => void;
  readonly __wbg_subscriptionhandle_free: (a: number, b: number) => void;
  readonly subscriptionhandle_id: (a: number, b: number) => void;
  readonly subscriptionhandle_close: (a: number, b: number) => void;
  readonly subscriptionhandle_isActive: (a: number) => number;
  readonly subscribeToIdentityBalanceUpdates: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly subscribeToDataContractUpdates: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly subscribeToDocumentUpdates: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly subscribeToBlockHeaders: (a: number, b: number, c: number, d: number) => void;
  readonly subscribeToStateTransitionResults: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbg_subscriptionhandlev2_free: (a: number, b: number) => void;
  readonly subscriptionhandlev2_id: (a: number, b: number) => void;
  readonly subscriptionhandlev2_close: (a: number, b: number) => void;
  readonly subscriptionhandlev2_isActive: (a: number) => number;
  readonly subscribeToIdentityBalanceUpdatesV2: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly subscribeToDataContractUpdatesV2: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly subscribeToDocumentUpdatesV2: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly subscribeWithHandlersV2: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly cleanupAllSubscriptions: () => void;
  readonly getActiveSubscriptionCount: () => number;
  readonly __wbg_subscriptionoptions_free: (a: number, b: number) => void;
  readonly __wbg_get_subscriptionoptions_auto_reconnect: (a: number) => number;
  readonly __wbg_set_subscriptionoptions_auto_reconnect: (a: number, b: number) => void;
  readonly __wbg_get_subscriptionoptions_max_reconnect_attempts: (a: number) => number;
  readonly __wbg_set_subscriptionoptions_max_reconnect_attempts: (a: number, b: number) => void;
  readonly __wbg_get_subscriptionoptions_reconnect_delay_ms: (a: number) => number;
  readonly __wbg_set_subscriptionoptions_reconnect_delay_ms: (a: number, b: number) => void;
  readonly __wbg_get_subscriptionoptions_connection_timeout_ms: (a: number) => number;
  readonly __wbg_set_subscriptionoptions_connection_timeout_ms: (a: number, b: number) => void;
  readonly subscriptionoptions_new: () => number;
  readonly __wbg_tokenoptions_free: (a: number, b: number) => void;
  readonly tokenoptions_new: () => number;
  readonly tokenoptions_withRetries: (a: number, b: number) => number;
  readonly tokenoptions_withTimeout: (a: number, b: number) => number;
  readonly mintTokens: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly burnTokens: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly transferTokens: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
  readonly freezeTokens: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly unfreezeTokens: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly getTokenBalance: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly getTokenInfo: (a: number, b: number, c: number, d: number) => number;
  readonly createTokenIssuance: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly createTokenBurn: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly __wbg_tokenmetadata_free: (a: number, b: number) => void;
  readonly tokenmetadata_name: (a: number, b: number) => void;
  readonly tokenmetadata_symbol: (a: number, b: number) => void;
  readonly tokenmetadata_decimals: (a: number) => number;
  readonly tokenmetadata_iconUrl: (a: number, b: number) => void;
  readonly tokenmetadata_description: (a: number, b: number) => void;
  readonly getContractTokens: (a: number, b: number, c: number, d: number) => number;
  readonly getTokenHolders: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly getTokenTransactions: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly createBatchTokenTransfer: (a: number, b: number, c: number, d: number, e: number, f: number, g: bigint, h: number) => void;
  readonly monitorTokenEvents: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly verify_identity_by_id: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly verify_data_contract_by_id: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly verifyDocuments: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
  readonly verifyDocumentsWithContract: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
  readonly __wbg_verifydocumentquery_free: (a: number, b: number) => void;
  readonly verifydocumentquery_new: (a: number, b: number, c: number, d: number) => number;
  readonly verifydocumentquery_setWhere: (a: number, b: number, c: number) => void;
  readonly verifydocumentquery_setOrderBy: (a: number, b: number, c: number) => void;
  readonly verifydocumentquery_setLimit: (a: number, b: number) => void;
  readonly verifydocumentquery_setStartAt: (a: number, b: number, c: number) => void;
  readonly __wbg_documentverificationresult_free: (a: number, b: number) => void;
  readonly documentverificationresult_rootHash: (a: number, b: number) => void;
  readonly documentverificationresult_documentsJson: (a: number, b: number) => void;
  readonly verifyDocumentsBridge: (a: number, b: number, c: number, d: number) => void;
  readonly verifySingleDocument: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly __wbg_votechoice_free: (a: number, b: number) => void;
  readonly votechoice_yes: (a: number, b: number) => number;
  readonly votechoice_no: (a: number, b: number) => number;
  readonly votechoice_abstain: (a: number, b: number) => number;
  readonly votechoice_voteType: (a: number, b: number) => void;
  readonly votechoice_reason: (a: number, b: number) => void;
  readonly __wbg_votepoll_free: (a: number, b: number) => void;
  readonly votepoll_id: (a: number, b: number) => void;
  readonly votepoll_title: (a: number, b: number) => void;
  readonly votepoll_description: (a: number, b: number) => void;
  readonly votepoll_startTime: (a: number) => bigint;
  readonly votepoll_endTime: (a: number) => bigint;
  readonly votepoll_voteOptions: (a: number) => number;
  readonly votepoll_requiredVotes: (a: number) => number;
  readonly votepoll_currentVotes: (a: number) => number;
  readonly votepoll_isActive: (a: number) => number;
  readonly votepoll_getRemainingTime: (a: number) => bigint;
  readonly votepoll_toObject: (a: number, b: number) => void;
  readonly __wbg_voteresult_free: (a: number, b: number) => void;
  readonly voteresult_pollId: (a: number, b: number) => void;
  readonly voteresult_yesVotes: (a: number) => number;
  readonly voteresult_noVotes: (a: number) => number;
  readonly voteresult_abstainVotes: (a: number) => number;
  readonly voteresult_totalVotes: (a: number) => number;
  readonly voteresult_passed: (a: number) => number;
  readonly voteresult_getPercentage: (a: number, b: number, c: number) => number;
  readonly voteresult_toObject: (a: number, b: number) => void;
  readonly createVoteTransition: (a: number, b: number, c: number, d: number, e: number, f: number, g: bigint, h: number) => void;
  readonly fetchActiveVotePolls: (a: number, b: number) => number;
  readonly fetchVotePoll: (a: number, b: number, c: number) => number;
  readonly fetchVoteResults: (a: number, b: number, c: number) => number;
  readonly hasVoted: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly getVoterVote: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly delegateVotingPower: (a: number, b: number, c: number, d: number, e: number, f: bigint, g: number) => void;
  readonly revokeVotingDelegation: (a: number, b: number, c: number, d: bigint, e: number) => void;
  readonly createVotePoll: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: bigint, k: number) => void;
  readonly getVotingPower: (a: number, b: number, c: number) => number;
  readonly monitorVotePoll: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbg_withdrawaloptions_free: (a: number, b: number) => void;
  readonly withdrawaloptions_new: () => number;
  readonly withdrawaloptions_withRetries: (a: number, b: number) => number;
  readonly withdrawaloptions_withTimeout: (a: number, b: number) => number;
  readonly withdrawaloptions_withFeeMultiplier: (a: number, b: number) => number;
  readonly withdrawFromIdentity: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly createWithdrawalTransition: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly getWithdrawalStatus: (a: number, b: number, c: number, d: number) => number;
  readonly getIdentityWithdrawals: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly calculateWithdrawalFee: (a: number, b: number, c: number, d: number) => void;
  readonly broadcastWithdrawal: (a: number, b: number, c: number, d: number) => number;
  readonly estimateWithdrawalTime: (a: number, b: number) => number;
  readonly rustsecp256k1_v0_10_0_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_10_0_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_10_0_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_10_0_default_error_callback_fn: (a: number, b: number) => void;
  readonly verifyFullIdentitiesByPublicKeyHashesVec: (a: number, b: number, c: number, d: number) => void;
  readonly verifyFullIdentitiesByPublicKeyHashesMap: (a: number, b: number, c: number, d: number) => void;
  readonly verifyFullIdentityByIdentityId: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyFullIdentityByNonUniquePublicKeyHash: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyFullIdentityByUniquePublicKeyHash: (a: number, b: number, c: number, d: number) => void;
  readonly verifyIdentitiesContractKeys: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly __wbg_verifyidentitybalanceandrevisionforidentityidresult_free: (a: number, b: number) => void;
  readonly verifyidentitybalanceandrevisionforidentityidresult_root_hash: (a: number) => number;
  readonly verifyidentitybalanceandrevisionforidentityidresult_balance: (a: number, b: number) => void;
  readonly verifyidentitybalanceandrevisionforidentityidresult_revision: (a: number, b: number) => void;
  readonly verifyIdentityBalanceAndRevisionForIdentityId: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_verifyidentitybalanceforidentityidresult_free: (a: number, b: number) => void;
  readonly verifyidentitybalanceforidentityidresult_root_hash: (a: number) => number;
  readonly verifyidentitybalanceforidentityidresult_balance: (a: number, b: number) => void;
  readonly verifyIdentityBalanceForIdentityId: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityBalancesForIdentityIdsVec: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityBalancesForIdentityIdsMap: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityContractNonce: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyidentityidbynonuniquepublickeyhashresult_root_hash: (a: number) => number;
  readonly verifyIdentityIdByNonUniquePublicKeyHash: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyIdentityIdByUniquePublicKeyHash: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityIdsByUniquePublicKeyHashesVec: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityIdsByUniquePublicKeyHashesMap: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityKeysByIdentityId: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly verifyIdentityNonce: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityRevisionForIdentityId: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyDocumentProof: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: bigint, n: number) => void;
  readonly verifyDocumentProofKeepSerialized: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: bigint, n: number) => void;
  readonly verifyStartAtDocumentInProof: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: bigint, n: number, o: number, p: number) => void;
  readonly __wbg_singledocumentdrivequerywasm_free: (a: number, b: number) => void;
  readonly singledocumentdrivequerywasm_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => void;
  readonly singledocumentdrivequerywasm_contractId: (a: number, b: number) => void;
  readonly singledocumentdrivequerywasm_documentTypeName: (a: number, b: number) => void;
  readonly singledocumentdrivequerywasm_documentTypeKeepsHistory: (a: number) => number;
  readonly singledocumentdrivequerywasm_documentId: (a: number, b: number) => void;
  readonly singledocumentdrivequerywasm_blockTimeMs: (a: number, b: number) => void;
  readonly singledocumentdrivequerywasm_contestedStatus: (a: number) => number;
  readonly __wbg_singledocumentproofresult_free: (a: number, b: number) => void;
  readonly singledocumentproofresult_rootHash: (a: number, b: number) => void;
  readonly singledocumentproofresult_documentSerialized: (a: number, b: number) => void;
  readonly singledocumentproofresult_hasDocument: (a: number) => number;
  readonly verifySingleDocumentProofKeepSerialized: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly createSingleDocumentQuery: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly createSingleDocumentQueryMaybeContested: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly createSingleDocumentQueryContested: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly verifyContract: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly verifyContractHistory: (a: number, b: number, c: number, d: bigint, e: number, f: number, g: number) => void;
  readonly verifyTokenBalancesForIdentityIdVec: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenBalancesForIdentityIdMap: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenBalancesForIdentityIdsVec: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenBalancesForIdentityIdsMap: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenDirectSellingPricesVec: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTokenDirectSellingPricesMap: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTokenInfosForIdentityIdVec: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenInfosForIdentityIdMap: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenInfosForIdentityIdsVec: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenInfosForIdentityIdsMap: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenPreProgrammedDistributionsVec: (a: number, b: number, c: number, d: number, e: bigint, f: number, g: number, h: number, i: number) => void;
  readonly verifyTokenPreProgrammedDistributionsMap: (a: number, b: number, c: number, d: number, e: bigint, f: number, g: number, h: number, i: number) => void;
  readonly verifyTokenStatusesVec: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTokenStatusesMap: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTokenBalanceForIdentityId: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenContractInfo: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTokenDirectSellingPrice: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTokenInfoForIdentityId: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyTokenPerpetualDistributionLastPaidTime: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly verifyTokenStatus: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTokenTotalSupplyAndAggregatedIdentityBalance: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyActionSignersVec: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly verifyActionSignersMap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly __wbg_verifyactioninfosincontractresult_free: (a: number, b: number) => void;
  readonly verifyactioninfosincontractresult_root_hash: (a: number) => number;
  readonly verifyactioninfosincontractresult_actions: (a: number) => number;
  readonly verifyActionInfosInContractVec: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly verifyActionInfosInContractMap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly verifyGroupInfosInContractVec: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly verifyGroupInfosInContractMap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly __wbg_verifyactionsignerstotalpowerresult_free: (a: number, b: number) => void;
  readonly verifyactionsignerstotalpowerresult_root_hash: (a: number) => number;
  readonly verifyactionsignerstotalpowerresult_action_status: (a: number) => number;
  readonly verifyactionsignerstotalpowerresult_total_power: (a: number) => bigint;
  readonly verifyActionSignersTotalPower: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly verifyGroupInfo: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyIdentityVotesGivenProofVec: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyIdentityVotesGivenProofMap: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyVotePollsEndDateQueryVec: (a: number, b: number, c: number, d: number) => void;
  readonly verifyVotePollsEndDateQueryMap: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_verifycontestsproofresult_free: (a: number, b: number) => void;
  readonly verifycontestsproofresult_root_hash: (a: number) => number;
  readonly verifycontestsproofresult_contests: (a: number) => number;
  readonly verifyContestsProof: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly verifyMasternodeVote: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly verifySpecializedBalance: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyVotePollVoteStateProof: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number) => void;
  readonly verifyVotePollVotesProof: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly verifyElements: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyEpochInfos: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly verifyEpochProposersByRangeVec: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly verifyEpochProposersByRangeMap: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly verifyEpochProposersByIdsVec: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyEpochProposersByIdsMap: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyTotalCreditsInSystem: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly verifyUpgradeState: (a: number, b: number, c: number) => void;
  readonly verifyUpgradeVoteStatus: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_tokentransitionpathqueryresult_free: (a: number, b: number) => void;
  readonly tokentransitionpathqueryresult_path_query: (a: number) => number;
  readonly tokenTransitionIntoPathQuery: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly tokenBalanceForIdentityIdQuery: (a: number, b: number, c: number) => void;
  readonly tokenBalancesForIdentityIdsQuery: (a: number, b: number, c: number) => void;
  readonly tokenInfoForIdentityIdQuery: (a: number, b: number, c: number) => void;
  readonly tokenDirectPurchasePriceQuery: (a: number, b: number) => void;
  readonly groupActiveAndClosedActionSingleSignerQuery: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly verifyStateTransitionWasExecutedWithProof: (a: number, b: number, c: bigint, d: bigint, e: number, f: number, g: number, h: number) => void;
  readonly main: () => void;
  readonly wasmsdkbuilder_new_testnet: () => number;
  readonly identitywasm_getBalance: (a: number) => number;
  readonly __wbg_identityrevision_free: (a: number, b: number) => void;
  readonly __wbg_memoryoptimizer_free: (a: number, b: number) => void;
  readonly __wbg_hdsigner_free: (a: number, b: number) => void;
  readonly identityrevision_updatedAt: (a: number) => bigint;
  readonly identityrevision_revision: (a: number) => bigint;
  readonly hdsigner_derivationPath: (a: number, b: number) => void;
  readonly __wbg_verifyidentitynonceresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokenbalanceforidentityidresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytotalcreditsinsystemresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentityrevisionforidentityidresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentitycontractnonceresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyspecializedbalanceresult_free: (a: number, b: number) => void;
  readonly __wbg_verifystartatdocumentinproofresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyelementsresult_free: (a: number, b: number) => void;
  readonly __wbg_verifygroupinfosincontractresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyvotepollsenddatequeryresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokencontractinforesult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokeninfoforidentityidresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentitiescontractkeysresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokendirectsellingpriceresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentityvotesgivenproofresult_free: (a: number, b: number) => void;
  readonly __wbg_verifydocumentproofkeepserializedresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyvotepollvotestateproofresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokeninfosforidentityidresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokendirectsellingpricesresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokeninfosforidentityidsresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyfullidentitybyidentityidresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentitykeysbyidentityidresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokenbalancesforidentityidresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokenbalancesforidentityidsresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokenpreprogrammeddistributionsresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentitybalancesforidentityidsresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyfullidentitiesbypublickeyhashesresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyfullidentitybyuniquepublickeyhashresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentityidsbyuniquepublickeyhashesresult_free: (a: number, b: number) => void;
  readonly __wbg_verifymasternodevoteresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyfullidentitybynonuniquepublickeyhashresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokenperpetualdistributionlastpaidtimeresult_free: (a: number, b: number) => void;
  readonly __wbg_verifystatetransitionwasexecutedwithproofresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokentotalsupplyandaggregatedidentitybalanceresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyupgradevotestatusresult_free: (a: number, b: number) => void;
  readonly __wbg_verifycontractresult_free: (a: number, b: number) => void;
  readonly __wbg_verifygroupinforesult_free: (a: number, b: number) => void;
  readonly __wbg_verifydocumentproofresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyepochinfosresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokenstatusresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyupgradestateresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyactionsignersresult_free: (a: number, b: number) => void;
  readonly __wbg_verifytokenstatusesresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyepochproposersresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentityidbynonuniquepublickeyhashresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyvotepollvotesproofresult_free: (a: number, b: number) => void;
  readonly __wbg_verifycontracthistoryresult_free: (a: number, b: number) => void;
  readonly __wbg_verifyidentityidbyuniquepublickeyhashresult_free: (a: number, b: number) => void;
  readonly verifyidentityrevisionforidentityidresult_revision: (a: number, b: number) => void;
  readonly verifyidentityrevisionforidentityidresult_root_hash: (a: number) => number;
  readonly verifytokeninfosforidentityidresult_token_infos: (a: number) => number;
  readonly verifytokeninfosforidentityidresult_root_hash: (a: number) => number;
  readonly verifyvotepollvotestateproofresult_result: (a: number) => number;
  readonly verifyvotepollvotestateproofresult_root_hash: (a: number) => number;
  readonly verifytokenbalancesforidentityidresult_balances: (a: number) => number;
  readonly verifytokenbalancesforidentityidresult_root_hash: (a: number) => number;
  readonly verifytokendirectsellingpriceresult_price: (a: number) => number;
  readonly verifytokendirectsellingpriceresult_root_hash: (a: number) => number;
  readonly verifyidentityvotesgivenproofresult_votes: (a: number) => number;
  readonly verifyidentityvotesgivenproofresult_root_hash: (a: number) => number;
  readonly verifytokenbalanceforidentityidresult_balance: (a: number, b: number) => void;
  readonly verifytokenbalanceforidentityidresult_root_hash: (a: number) => number;
  readonly verifyupgradevotestatusresult_vote_status: (a: number) => number;
  readonly verifyupgradevotestatusresult_root_hash: (a: number) => number;
  readonly verifyfullidentitybyidentityidresult_identity: (a: number) => number;
  readonly verifyfullidentitybyidentityidresult_root_hash: (a: number) => number;
  readonly verifyvotepollvotesproofresult_votes: (a: number) => number;
  readonly verifyvotepollvotesproofresult_root_hash: (a: number) => number;
  readonly verifyepochinfosresult_epoch_infos: (a: number) => number;
  readonly verifyepochinfosresult_root_hash: (a: number) => number;
  readonly verifytokenstatusesresult_statuses: (a: number) => number;
  readonly verifytokenstatusesresult_root_hash: (a: number) => number;
  readonly verifyspecializedbalanceresult_balance: (a: number, b: number) => void;
  readonly verifyspecializedbalanceresult_root_hash: (a: number) => number;
  readonly verifytokeninfosforidentityidsresult_token_infos: (a: number) => number;
  readonly verifytokeninfosforidentityidsresult_root_hash: (a: number) => number;
  readonly verifytokendirectsellingpricesresult_prices: (a: number) => number;
  readonly verifytokendirectsellingpricesresult_root_hash: (a: number) => number;
  readonly verifyelementsresult_elements: (a: number) => number;
  readonly verifyelementsresult_root_hash: (a: number) => number;
  readonly verifytokencontractinforesult_contract_info: (a: number) => number;
  readonly verifytokencontractinforesult_root_hash: (a: number) => number;
  readonly verifyidentitynonceresult_nonce: (a: number, b: number) => void;
  readonly verifyidentitynonceresult_root_hash: (a: number) => number;
  readonly verifygroupinforesult_group: (a: number) => number;
  readonly verifygroupinforesult_root_hash: (a: number) => number;
  readonly verifytokenstatusresult_status: (a: number) => number;
  readonly verifytokenstatusresult_root_hash: (a: number) => number;
  readonly verifyidentityidbyuniquepublickeyhashresult_identity_id: (a: number, b: number) => void;
  readonly verifydocumentproofresult_documents: (a: number) => number;
  readonly verifydocumentproofresult_root_hash: (a: number) => number;
  readonly verifyfullidentitybyuniquepublickeyhashresult_identity: (a: number) => number;
  readonly verifyfullidentitybyuniquepublickeyhashresult_root_hash: (a: number) => number;
  readonly verifystatetransitionwasexecutedwithproofresult_proof_result: (a: number) => number;
  readonly verifystatetransitionwasexecutedwithproofresult_root_hash: (a: number) => number;
  readonly verifyepochproposersresult_proposers: (a: number) => number;
  readonly verifyepochproposersresult_root_hash: (a: number) => number;
  readonly verifyidentitykeysbyidentityidresult_identity: (a: number) => number;
  readonly verifyidentitykeysbyidentityidresult_root_hash: (a: number) => number;
  readonly verifyvotepollsenddatequeryresult_vote_polls: (a: number) => number;
  readonly verifyvotepollsenddatequeryresult_root_hash: (a: number) => number;
  readonly verifyfullidentitybynonuniquepublickeyhashresult_identity: (a: number) => number;
  readonly verifyfullidentitybynonuniquepublickeyhashresult_root_hash: (a: number) => number;
  readonly verifytokenpreprogrammeddistributionsresult_distributions: (a: number) => number;
  readonly verifytokenpreprogrammeddistributionsresult_root_hash: (a: number) => number;
  readonly verifyfullidentitiesbypublickeyhashesresult_identities: (a: number) => number;
  readonly verifyfullidentitiesbypublickeyhashesresult_root_hash: (a: number) => number;
  readonly verifyactionsignersresult_signers: (a: number) => number;
  readonly verifyactionsignersresult_root_hash: (a: number) => number;
  readonly verifytokenbalancesforidentityidsresult_balances: (a: number) => number;
  readonly verifytokenbalancesforidentityidsresult_root_hash: (a: number) => number;
  readonly verifycontracthistoryresult_contract_history: (a: number) => number;
  readonly verifycontracthistoryresult_root_hash: (a: number) => number;
  readonly verifyupgradestateresult_upgrade_state: (a: number) => number;
  readonly verifyupgradestateresult_root_hash: (a: number) => number;
  readonly verifytokentotalsupplyandaggregatedidentitybalanceresult_total_supply_and_balance: (a: number) => number;
  readonly verifytokentotalsupplyandaggregatedidentitybalanceresult_root_hash: (a: number) => number;
  readonly verifyidentitybalancesforidentityidsresult_balances: (a: number) => number;
  readonly verifyidentitybalancesforidentityidsresult_root_hash: (a: number) => number;
  readonly verifyidentitiescontractkeysresult_keys: (a: number) => number;
  readonly verifyidentitiescontractkeysresult_root_hash: (a: number) => number;
  readonly verifyidentitycontractnonceresult_nonce: (a: number, b: number) => void;
  readonly verifyidentitycontractnonceresult_root_hash: (a: number) => number;
  readonly verifystartatdocumentinproofresult_document: (a: number) => number;
  readonly verifystartatdocumentinproofresult_root_hash: (a: number) => number;
  readonly verifygroupinfosincontractresult_groups: (a: number) => number;
  readonly verifygroupinfosincontractresult_root_hash: (a: number) => number;
  readonly verifydocumentproofkeepserializedresult_serialized_documents: (a: number) => number;
  readonly verifydocumentproofkeepserializedresult_root_hash: (a: number) => number;
  readonly verifyidentityidsbyuniquepublickeyhashesresult_identity_ids: (a: number) => number;
  readonly verifyidentityidsbyuniquepublickeyhashesresult_root_hash: (a: number) => number;
  readonly verifymasternodevoteresult_vote: (a: number, b: number) => void;
  readonly verifymasternodevoteresult_root_hash: (a: number) => number;
  readonly verifyidentityidbynonuniquepublickeyhashresult_identity_id: (a: number, b: number) => void;
  readonly verifyidentityidbyuniquepublickeyhashresult_root_hash: (a: number) => number;
  readonly verifycontractresult_contract: (a: number) => number;
  readonly verifycontractresult_root_hash: (a: number) => number;
  readonly verifytotalcreditsinsystemresult_total_credits: (a: number) => bigint;
  readonly verifytotalcreditsinsystemresult_root_hash: (a: number) => number;
  readonly verifytokeninfoforidentityidresult_token_info: (a: number) => number;
  readonly verifytokeninfoforidentityidresult_root_hash: (a: number) => number;
  readonly verifytokenperpetualdistributionlastpaidtimeresult_last_paid_time: (a: number) => number;
  readonly verifytokenperpetualdistributionlastpaidtimeresult_root_hash: (a: number) => number;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: (a: number) => void;
  readonly __wbindgen_export_3: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_5: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: (a: number, b: number) => void;
  readonly __wbindgen_export_7: (a: number, b: number) => void;
  readonly __wbindgen_export_8: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
