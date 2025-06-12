/**
 * Interface for MCP resources.
 * @template TParams - The type of parameters extracted from the URI
 * @template TContent - The type of content returned by the resource
 */
export interface Resource<TParams = unknown, TContent = unknown> {
  /**
   * Gets the URI pattern for this resource.
   * @returns The URI pattern.
   */
  getUriPattern(): string;

  /**
   * Gets the content of the resource.
   * @param params The resource parameters extracted from the URI.
   * @returns The resource content.
   */
  getContent(params: TParams): Promise<TContent>;
}

/**
 * Base class for MCP resources.
 */
export abstract class BaseResource<TParams = unknown, TContent = unknown>
  implements Resource<TParams, TContent>
{
  /**
   * Gets the URI pattern for this resource.
   * @returns The URI pattern.
   */
  public getUriPattern(): string {
    return this.getResourceUriPattern();
  }

  /**
   * Gets the URI pattern for this resource.
   * @returns The URI pattern.
   */
  protected abstract getResourceUriPattern(): string;

  /**
   * Gets the content of the resource.
   * @param params The resource parameters extracted from the URI.
   * @returns The resource content.
   */
  public async getContent(params: TParams): Promise<TContent> {
    return this.getResourceContent(params);
  }

  /**
   * Gets the content of the resource.
   * @param params The resource parameters extracted from the URI.
   * @returns The resource content.
   */
  protected abstract getResourceContent(params: TParams): Promise<TContent>;
}
