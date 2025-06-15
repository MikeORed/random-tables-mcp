import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

/**
 * A helper class for testing the MCP server.
 */
export class McpClient {
  private client: Client;
  private serverProcess: ChildProcess | null = null;

  /**
   * Creates a new McpClient instance.
   */
  constructor() {
    this.client = new Client({
      name: 'random-tables-mcp-test-client',
      version: '1.0.0',
    });
  }

  /**
   * Connects to the MCP server.
   */
  async connect(): Promise<void> {
    // Start the server process
    const serverPath = path.join(process.cwd(), 'dist', 'index.js');
    this.serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (!this.serverProcess.stdin || !this.serverProcess.stdout) {
      throw new Error('Failed to start server process');
    }

    // Create a transport that communicates with the server process
    const transport = new StdioClientTransport({
      command: `node ${serverPath}`,
    });

    // Connect the client to the transport
    await this.client.connect(transport);

    // Wait for the server to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Disconnects from the MCP server.
   */
  async disconnect(): Promise<void> {
    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = null;
    }
  }

  /**
   * Calls a tool on the MCP server.
   * @param name The name of the tool to call.
   * @param args The arguments to pass to the tool.
   * @returns The result of the tool call.
   */
  async callTool(name: string, args: Record<string, any>): Promise<any> {
    const response = await this.client.callTool({
      name,
      arguments: args,
    });

    // Extract the result from the response
    if (response.content && Array.isArray(response.content) && response.content.length > 0) {
      const content = response.content[0];
      if (content.type === 'text' && typeof content.text === 'string') {
        return JSON.parse(content.text);
      }
      throw new Error(`Unexpected content type: ${content.type}`);
    }
    throw new Error('No content in response');
  }

  /**
   * Reads a resource from the MCP server.
   * @param uri The URI of the resource to read.
   * @returns The content of the resource.
   */
  async readResource(uri: string): Promise<any> {
    const response = await this.client.readResource({
      uri,
    });

    // Extract the content from the response
    if (response.content && Array.isArray(response.content) && response.content.length > 0) {
      const content = response.content[0];
      if (content.type === 'text' && typeof content.text === 'string') {
        return JSON.parse(content.text);
      }
      throw new Error(`Unexpected content type: ${content.type}`);
    }
    throw new Error('No content in response');
  }
}
