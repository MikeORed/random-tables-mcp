import { TemplateReference } from './template-reference.js';

/**
 * Represents a template string that can contain references to other tables.
 * References are in the format {{reference-title::table-id::table-name::roll-number::separator}}
 */
export class RollTemplate {
  /**
   * Regular expression to match template references.
   * Matches anything between {{ and }}, including empty references.
   */
  private static readonly REFERENCE_REGEX = /\{\{([^}]*)\}\}/g;

  /**
   * Maximum depth for template resolution to prevent infinite loops.
   */
  public static readonly MAX_RESOLUTION_DEPTH = 5;

  /**
   * Creates a new RollTemplate instance.
   * @param template The template string
   */
  constructor(public readonly template: string) {}

  /**
   * Checks if a string contains template references.
   * @param text The string to check
   * @returns True if the string contains template references, false otherwise
   */
  static isTemplate(text: string): boolean {
    // Reset the regex state before testing
    RollTemplate.REFERENCE_REGEX.lastIndex = 0;
    return RollTemplate.REFERENCE_REGEX.test(text);
  }

  /**
   * Extracts all template references from the template string.
   * @returns An array of TemplateReference objects
   */
  extractReferences(): TemplateReference[] {
    const references: TemplateReference[] = [];
    let match;

    // Reset the regex state
    RollTemplate.REFERENCE_REGEX.lastIndex = 0;

    while ((match = RollTemplate.REFERENCE_REGEX.exec(this.template)) !== null) {
      references.push(TemplateReference.fromString(match[1]));
    }

    return references;
  }

  /**
   * Replaces a reference in the template with a value.
   * @param reference The reference to replace
   * @param value The value to replace it with
   * @returns A new RollTemplate with the reference replaced
   */
  replaceReference(reference: TemplateReference, value: string): RollTemplate {
    // Get the exact reference string as it appears in the template
    const refString = reference.toString();

    // Simple string replacement of the first occurrence
    const index = this.template.indexOf(refString);
    if (index !== -1) {
      const newTemplate =
        this.template.substring(0, index) +
        value +
        this.template.substring(index + refString.length);
      return new RollTemplate(newTemplate);
    }

    // If reference not found, return unchanged template
    return this;
  }

  /**
   * Checks if the template still contains unresolved references.
   * @returns True if the template contains unresolved references, false otherwise
   */
  hasUnresolvedReferences(): boolean {
    return RollTemplate.isTemplate(this.template);
  }

  /**
   * Returns the template string.
   * @returns The template string
   */
  toString(): string {
    return this.template;
  }
}
