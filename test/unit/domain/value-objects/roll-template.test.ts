import { RollTemplate } from '../../../../src/domain/value-objects/roll-template';
import { TemplateReference } from '../../../../src/domain/value-objects/template-reference';

describe('RollTemplate', () => {
  describe('constructor', () => {
    it('should create a RollTemplate with a template string', () => {
      const template = new RollTemplate('You encounter a {{monster::monster-table::monsters}}');
      expect(template.template).toBe('You encounter a {{monster::monster-table::monsters}}');
    });
  });

  describe('isTemplate', () => {
    it('should return true for strings with template references', () => {
      expect(RollTemplate.isTemplate('You encounter a {{monster::monster-table::monsters}}')).toBe(
        true,
      );
      expect(
        RollTemplate.isTemplate('Multiple {{ref1::table1::name1}} and {{ref2::table2::name2}}'),
      ).toBe(true);
    });

    it('should return false for strings without template references', () => {
      expect(RollTemplate.isTemplate('Just a normal string')).toBe(false);
      expect(RollTemplate.isTemplate('Almost a template { but not quite }')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(RollTemplate.isTemplate('')).toBe(false);
      expect(RollTemplate.isTemplate('{{}}')).toBe(true); // Empty reference is still a reference
      expect(RollTemplate.isTemplate('{{ incomplete')).toBe(false);
    });
  });

  describe('extractReferences', () => {
    it('should extract a single reference', () => {
      const template = new RollTemplate('You encounter a {{monster::monster-table::monsters}}');
      const references = template.extractReferences();

      expect(references).toHaveLength(1);
      expect(references[0]).toBeInstanceOf(TemplateReference);
      expect(references[0].title).toBe('monster');
      expect(references[0].tableId).toBe('monster-table');
      expect(references[0].tableName).toBe('monsters');
    });

    it('should extract multiple references', () => {
      const template = new RollTemplate(
        'You encounter a {{monster::monster-table::monsters}} wielding a {{weapon::weapon-table::weapons}}',
      );
      const references = template.extractReferences();

      expect(references).toHaveLength(2);
      expect(references[0].title).toBe('monster');
      expect(references[1].title).toBe('weapon');
    });

    it('should return an empty array for templates without references', () => {
      const template = new RollTemplate('Just a normal string');
      const references = template.extractReferences();

      expect(references).toHaveLength(0);
    });

    it('should handle references with all parts', () => {
      const template = new RollTemplate('{{full::table-id::table-name::3::; }}');
      const references = template.extractReferences();

      expect(references).toHaveLength(1);
      expect(references[0].title).toBe('full');
      expect(references[0].tableId).toBe('table-id');
      expect(references[0].tableName).toBe('table-name');
      expect(references[0].rollCount).toBe(3);
      expect(references[0].separator).toBe('; ');
    });
  });

  describe('replaceReference', () => {
    it('should replace a reference with a value', () => {
      const template = new RollTemplate('You encounter a {{monster::monster-table::monsters}}');
      const reference = new TemplateReference('monster', 'monster-table', 'monsters');

      const newTemplate = template.replaceReference(reference, 'goblin');

      expect(newTemplate.template).toBe('You encounter a goblin');
    });

    it('should replace only the first occurrence of a reference', () => {
      const template = new RollTemplate(
        '{{monster::monster-table::monsters}} and another {{monster::monster-table::monsters}}',
      );
      const reference = new TemplateReference('monster', 'monster-table', 'monsters');
      const newTemplate = template.replaceReference(reference, 'goblin');

      expect(newTemplate.template).toBe('goblin and another {{monster::monster-table::monsters}}');
    });

    it('should return a new RollTemplate instance', () => {
      const template = new RollTemplate('You encounter a {{monster::monster-table::monsters}}');
      const reference = new TemplateReference('monster', 'monster-table', 'monsters');
      const newTemplate = template.replaceReference(reference, 'goblin');

      expect(newTemplate).not.toBe(template);
      expect(newTemplate).toBeInstanceOf(RollTemplate);
    });
  });

  describe('hasUnresolvedReferences', () => {
    it('should return true if the template still has references', () => {
      const template = new RollTemplate('You encounter a {{monster::monster-table::monsters}}');
      expect(template.hasUnresolvedReferences()).toBe(true);
    });

    it('should return false if the template has no references', () => {
      const template = new RollTemplate('You encounter a goblin');
      expect(template.hasUnresolvedReferences()).toBe(false);
    });

    it('should return true if some references are resolved but others remain', () => {
      const template = new RollTemplate(
        'You encounter a goblin wielding a {{weapon::weapon-table::weapons}}',
      );
      expect(template.hasUnresolvedReferences()).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the template string', () => {
      const templateStr = 'You encounter a {{monster::monster-table::monsters}}';
      const template = new RollTemplate(templateStr);
      expect(template.toString()).toBe(templateStr);
    });
  });

  describe('MAX_RESOLUTION_DEPTH', () => {
    it('should have a maximum resolution depth defined', () => {
      expect(RollTemplate.MAX_RESOLUTION_DEPTH).toBeDefined();
      expect(typeof RollTemplate.MAX_RESOLUTION_DEPTH).toBe('number');
      expect(RollTemplate.MAX_RESOLUTION_DEPTH).toBeGreaterThan(0);
    });
  });
});
