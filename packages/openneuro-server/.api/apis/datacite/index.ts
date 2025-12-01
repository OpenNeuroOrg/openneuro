import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'datacite/2.3.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Get a JSON API result of activities.
   *
   */
  getActivities(metadata?: types.GetActivitiesMetadataParam): Promise<FetchResponse<200, types.GetActivitiesResponse200>> {
    return this.core.fetch('/activities', 'get', metadata);
  }

  /**
   * Get a JSON API result of a specific activity.
   *
   */
  getActivitiesId(metadata: types.GetActivitiesIdMetadataParam): Promise<FetchResponse<200, types.GetActivitiesIdResponse200>> {
    return this.core.fetch('/activities/{id}', 'get', metadata);
  }

  /**
   * Return a list of client-prefixes.
   *
   */
  getClientPrefixes(metadata?: types.GetClientPrefixesMetadataParam): Promise<FetchResponse<200, types.GetClientPrefixesResponse200>> {
    return this.core.fetch('/client-prefixes', 'get', metadata);
  }

  /**
   * Return a list of clients (repositories).
   *
   */
  getClients(metadata?: types.GetClientsMetadataParam): Promise<FetchResponse<200, types.GetClientsResponse200>> {
    return this.core.fetch('/clients', 'get', metadata);
  }

  /**
   * Return clients DOI production statistics.
   *
   */
  getClientsTotals(metadata?: types.GetClientsTotalsMetadataParam): Promise<FetchResponse<200, types.GetClientsTotalsResponse200>> {
    return this.core.fetch('/clients/totals', 'get', metadata);
  }

  /**
   * Return a client.
   *
   */
  getClientsId(metadata: types.GetClientsIdMetadataParam): Promise<FetchResponse<200, types.GetClientsIdResponse200>> {
    return this.core.fetch('/clients/{id}', 'get', metadata);
  }

  /**
   * Add a new repository.
   *
   */
  postRepositories(body: types.PostRepositoriesBodyParam): Promise<FetchResponse<201, types.PostRepositoriesResponse201>> {
    return this.core.fetch('/repositories', 'post', body);
  }

  /**
   * Update a repository.
   *
   */
  putRepositoriesId(body: types.PutRepositoriesIdBodyParam, metadata: types.PutRepositoriesIdMetadataParam): Promise<FetchResponse<200, types.PutRepositoriesIdResponse200>> {
    return this.core.fetch('/repositories/{id}', 'put', body, metadata);
  }

  /**
   * Delete a repository (only possible if no DOIs are in the repository)
   *
   */
  deleteRepositoriesId(metadata: types.DeleteRepositoriesIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/repositories/{id}', 'delete', metadata);
  }

  /**
   * Return a list of DOIs.
   *
   */
  getDois(metadata?: types.GetDoisMetadataParam): Promise<FetchResponse<200, types.GetDoisResponse200>> {
    return this.core.fetch('/dois', 'get', metadata);
  }

  /**
   * Add a new DOI.
   *
   */
  postDois(body: types.PostDoisBodyParam, metadata?: types.PostDoisMetadataParam): Promise<FetchResponse<201, types.PostDoisResponse201>> {
    return this.core.fetch('/dois', 'post', body, metadata);
  }

  /**
   * Return a DOI.
   *
   */
  getDoisId(metadata: types.GetDoisIdMetadataParam): Promise<FetchResponse<200, types.GetDoisIdResponse200>> {
    return this.core.fetch('/dois/{id}', 'get', metadata);
  }

  /**
   * PUT requests to the /dois endpoint will update a DOI record if it already exists and
   * create a new record if the DOI name is not already taken.
   *
   * @summary Update a DOI.
   */
  putDoisId(body: types.PutDoisIdBodyParam, metadata: types.PutDoisIdMetadataParam): Promise<FetchResponse<200, types.PutDoisIdResponse200>> {
    return this.core.fetch('/dois/{id}', 'put', body, metadata);
  }

  /**
   * Delete a DOI (for DOIs in draft state only).
   *
   */
  deleteDoisId(metadata: types.DeleteDoisIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/dois/{id}', 'delete', metadata);
  }

  /**
   * Return activities for a specific DOI.
   *
   */
  getDoisIdActivities(metadata: types.GetDoisIdActivitiesMetadataParam): Promise<FetchResponse<200, types.GetDoisIdActivitiesResponse200>> {
    return this.core.fetch('/dois/{id}/activities', 'get', metadata);
  }

  /**
   * Return a list of events.
   *
   */
  getEvents(metadata?: types.GetEventsMetadataParam): Promise<FetchResponse<200, types.GetEventsResponse200>> {
    return this.core.fetch('/events', 'get', metadata);
  }

  /**
   * Return an event.
   *
   */
  getEventsId(metadata: types.GetEventsIdMetadataParam): Promise<FetchResponse<200, types.GetEventsIdResponse200>> {
    return this.core.fetch('/events/{id}', 'get', metadata);
  }

  /**
   * Return the current status of the REST API.
   *
   * @throws FetchError<500, types.GetHeartbeatResponse500> REST API is not working properly.
   */
  getHeartbeat(): Promise<FetchResponse<200, types.GetHeartbeatResponse200>> {
    return this.core.fetch('/heartbeat', 'get');
  }

  /**
   * Return a list of prefixes.
   *
   */
  getPrefixes(metadata?: types.GetPrefixesMetadataParam): Promise<FetchResponse<200, types.GetPrefixesResponse200>> {
    return this.core.fetch('/prefixes', 'get', metadata);
  }

  /**
   * Return prefixes DOI production statistics.
   *
   */
  getPrefixesTotals(metadata?: types.GetPrefixesTotalsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/prefixes/totals', 'get', metadata);
  }

  /**
   * Return a prefix.
   *
   */
  getPrefixesId(metadata: types.GetPrefixesIdMetadataParam): Promise<FetchResponse<200, types.GetPrefixesIdResponse200>> {
    return this.core.fetch('/prefixes/{id}', 'get', metadata);
  }

  /**
   * Return a list of provider-prefixes.
   *
   */
  getProviderPrefixes(metadata?: types.GetProviderPrefixesMetadataParam): Promise<FetchResponse<200, types.GetProviderPrefixesResponse200>> {
    return this.core.fetch('/provider-prefixes', 'get', metadata);
  }

  /**
   * Return a list of providers (including members and consortium organizations).
   *
   */
  getProviders(metadata?: types.GetProvidersMetadataParam): Promise<FetchResponse<200, types.GetProvidersResponse200>> {
    return this.core.fetch('/providers', 'get', metadata);
  }

  /**
   * Return providers DOI production statistics.
   *
   */
  getProvidersTotals(metadata?: types.GetProvidersTotalsMetadataParam): Promise<FetchResponse<200, types.GetProvidersTotalsResponse200>> {
    return this.core.fetch('/providers/totals', 'get', metadata);
  }

  /**
   * Return a provider.
   *
   */
  getProvidersId(metadata: types.GetProvidersIdMetadataParam): Promise<FetchResponse<200, types.GetProvidersIdResponse200>> {
    return this.core.fetch('/providers/{id}', 'get', metadata);
  }

  /**
   * A JSON array of reports.
   *
   */
  getReports(metadata?: types.GetReportsMetadataParam): Promise<FetchResponse<200, types.GetReportsResponse200>> {
    return this.core.fetch('/reports', 'get', metadata);
  }

  /**
   * Add a new report.
   *
   */
  postReports(body: types.PostReportsBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/reports', 'post', body);
  }

  /**
   * Return a report.
   *
   */
  getReportsId(metadata: types.GetReportsIdMetadataParam): Promise<FetchResponse<200, types.GetReportsIdResponse200>> {
    return this.core.fetch('/reports/{id}', 'get', metadata);
  }

  /**
   * Update a report.
   *
   */
  putReportsId(body: types.PutReportsIdBodyParam, metadata: types.PutReportsIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/reports/{id}', 'put', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { DeleteDoisIdMetadataParam, DeleteRepositoriesIdMetadataParam, GetActivitiesIdMetadataParam, GetActivitiesIdResponse200, GetActivitiesMetadataParam, GetActivitiesResponse200, GetClientPrefixesMetadataParam, GetClientPrefixesResponse200, GetClientsIdMetadataParam, GetClientsIdResponse200, GetClientsMetadataParam, GetClientsResponse200, GetClientsTotalsMetadataParam, GetClientsTotalsResponse200, GetDoisIdActivitiesMetadataParam, GetDoisIdActivitiesResponse200, GetDoisIdMetadataParam, GetDoisIdResponse200, GetDoisMetadataParam, GetDoisResponse200, GetEventsIdMetadataParam, GetEventsIdResponse200, GetEventsMetadataParam, GetEventsResponse200, GetHeartbeatResponse200, GetHeartbeatResponse500, GetPrefixesIdMetadataParam, GetPrefixesIdResponse200, GetPrefixesMetadataParam, GetPrefixesResponse200, GetPrefixesTotalsMetadataParam, GetProviderPrefixesMetadataParam, GetProviderPrefixesResponse200, GetProvidersIdMetadataParam, GetProvidersIdResponse200, GetProvidersMetadataParam, GetProvidersResponse200, GetProvidersTotalsMetadataParam, GetProvidersTotalsResponse200, GetReportsIdMetadataParam, GetReportsIdResponse200, GetReportsMetadataParam, GetReportsResponse200, PostDoisBodyParam, PostDoisMetadataParam, PostDoisResponse201, PostReportsBodyParam, PostRepositoriesBodyParam, PostRepositoriesResponse201, PutDoisIdBodyParam, PutDoisIdMetadataParam, PutDoisIdResponse200, PutReportsIdBodyParam, PutReportsIdMetadataParam, PutRepositoriesIdBodyParam, PutRepositoriesIdMetadataParam, PutRepositoriesIdResponse200 } from './types';
