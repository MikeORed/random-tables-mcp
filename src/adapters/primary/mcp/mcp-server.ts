import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TableService } from '../../../ports/primary/table-service';
import { RollService } from '../../../ports/primary/roll-service';
import { CreateTableTool } from './tools/create-table-tool';
import { RollOnTableTool } from './tools/roll-on-table-tool';
import { UpdateTableTool } from './tools/update-table-tool';
import { ListTablesTool } from './tools/list-tables-tool';
import { GetTableTool } from './tools/get-table-tool';
import { TableResource } from './resources/table-resource';
import { TablesResource } from './resources/tables-resource';
import { BaseTool } from './tools/tool';
import { BaseResource } from './resources/resource';

/**
 * MCP Server implementation for Random Tables.
 */
export class McpServer {
  private server: Server;
  private tools: BaseTool[];
  private resources: BaseResource[];

  /**
   * Creates a new McpServer instance.
   * @param tableService The table service to use.
   * @param rollService The roll service to use.
   */
  constructor(
    private readonly tableService: TableService,
    private readonly rollService: RollService,
  ) {
    this.server = new Server(
      {
        name: 'random-tables-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      },
    );

    // Check if resources can be used (defaults to false if not specified)
    const canUseResource = process.env.CAN_USE_RESOURCE === 'true';

    // Initialize tools
    this.tools = [
      new CreateTableTool(tableService),
      new RollOnTableTool(rollService),
      new UpdateTableTool(tableService),
      new ListTablesTool(tableService),
    ];

    // Add GetTableTool if resources cannot be used
    if (!canUseResource) {
      this.tools.push(new GetTableTool(tableService));
    }

    // Initialize resources
    this.resources = [new TablesResource(tableService)];

    // Add TableResource only if resources can be used
    if (canUseResource) {
      this.resources.push(new TableResource(tableService));
    }
  }

  /**
   * Initializes the server by registering tools and resources.
   */
  public initialize(): void {
    this.registerTools();
    this.registerResources();
  }

  /**
   * Registers tools with the server.
   */
  private registerTools(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, () => {
      return {
        tools: this.tools.map(tool => tool.getToolDefinition()),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      try {
        const { name, arguments: args } = request.params;
        const tool = this.tools.find(t => t.getName() === name);

        if (!tool) {
          throw new Error(`Unknown tool: ${name}`);
        }

        const result = await tool.execute(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    });
  }

  /**
   * Registers resources with the server.
   */
  private registerResources(): void {
    // Set up a handler for resource requests
    this.server.setRequestHandler(ReadResourceRequestSchema, async request => {
      try {
        const { uri } = request.params;

        // Find the resource that matches the URI pattern
        for (const resource of this.resources) {
          const uriPattern = resource.getUriPattern();
          const match = this.matchUriPattern(uri, uriPattern);

          if (match) {
            const content = await resource.getContent(match);
            return {
              content: [{ type: 'text', text: JSON.stringify(content, null, 2) }],
            };
          }
        }

        throw new Error(`No resource found for URI: ${uri}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    });
  }

  /**
   * Matches a URI against a pattern and extracts parameters.
   * @param uri The URI to match.
   * @param pattern The pattern to match against.
   * @returns An object with extracted parameters, or null if no match.
   */
  private matchUriPattern(uri: string, pattern: string): Record<string, string> | null {
    // Convert pattern to regex
    const regexPattern = pattern.replace(/{([^}]+)}/g, '([^/]+)');
    const regex = new RegExp(`^${regexPattern}$`);

    // Extract parameter names from pattern
    const paramNames: string[] = [];
    let match;
    const paramRegex = /{([^}]+)}/g;
    while ((match = paramRegex.exec(pattern)) !== null) {
      paramNames.push(match[1]);
    }

    // Match URI against regex
    const matches = uri.match(regex);
    if (!matches) {
      return null;
    }

    // Extract parameters
    const params: Record<string, string> = {};
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = matches[i + 1];
    }

    return params;
  }

  /**
   * Starts the server.
   */
  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.warn('MCP Random Tables Server running on stdio');
  }
}
