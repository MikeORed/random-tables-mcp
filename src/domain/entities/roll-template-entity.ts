import { RollTemplate } from '../value-objects/roll-template.js';

/**
 * Represents a roll template entity that can be persisted.
 * Unlike the RollTemplate value object, this entity has identity and metadata.
 */
export class RollTemplateEntity {
  /**
   * Creates a new RollTemplateEntity instance.
   * @param id Unique identifier for the template.
   * @param name Template name.
   * @param description Optional description.
   * @param template The RollTemplate value object.
   */
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly template: RollTemplate,
  ) {
    if (!id) {
      throw new Error('Template ID is required');
    }
    if (!name) {
      throw new Error('Template name is required');
    }
  }

  /**
   * Converts this template entity to a plain object.
   * @returns A plain object representation of this template entity.
   */
  toObject(): RollTemplateEntityDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      template: this.template.toString(),
    };
  }

  /**
   * Creates a RollTemplateEntity from a plain object.
   * @param obj The object to create the template entity from.
   * @returns A new RollTemplateEntity instance.
   */
  static fromObject(obj: RollTemplateEntityDTO): RollTemplateEntity {
    return new RollTemplateEntity(
      obj.id,
      obj.name,
      obj.description,
      new RollTemplate(obj.template),
    );
  }
}

/**
 * Data Transfer Object for RollTemplateEntity.
 */
export interface RollTemplateEntityDTO {
  id: string;
  name: string;
  description: string;
  template: string;
}
