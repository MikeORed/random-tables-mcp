import { InMemoryRollTemplateRepository } from '../../../../../src/adapters/secondary/persistence/in-memory-roll-template-repository.js';
import { RollTemplateEntity } from '../../../../../src/domain/entities/roll-template-entity.js';
import { RollTemplate } from '../../../../../src/domain/value-objects/roll-template.js';

describe('InMemoryRollTemplateRepository', () => {
  let repository: InMemoryRollTemplateRepository;
  let sampleTemplate: RollTemplateEntity;

  beforeEach(() => {
    repository = new InMemoryRollTemplateRepository();

    // Create a sample template for testing
    sampleTemplate = new RollTemplateEntity(
      'test-1',
      'Test Template',
      'A template for testing',
      new RollTemplate('This is a {{test::table-id::table-name}} template'),
    );
  });

  describe('save', () => {
    it('should save a template and return its ID', async () => {
      const id = await repository.save(sampleTemplate);

      expect(id).toBe(sampleTemplate.id);

      // Verify the template was saved by retrieving it
      const savedTemplate = await repository.getById(id);
      expect(savedTemplate).not.toBeNull();
      expect(savedTemplate?.id).toBe(sampleTemplate.id);
      expect(savedTemplate?.name).toBe(sampleTemplate.name);
      expect(savedTemplate?.description).toBe(sampleTemplate.description);
      expect(savedTemplate?.template.toString()).toBe(sampleTemplate.template.toString());
    });
  });

  describe('getById', () => {
    it('should return null for non-existent template', async () => {
      const result = await repository.getById('non-existent');
      expect(result).toBeNull();
    });

    it('should retrieve a saved template by ID', async () => {
      await repository.save(sampleTemplate);

      const result = await repository.getById(sampleTemplate.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(sampleTemplate.id);
      expect(result?.name).toBe(sampleTemplate.name);
      expect(result?.description).toBe(sampleTemplate.description);
      expect(result?.template.toString()).toBe(sampleTemplate.template.toString());
    });
  });

  describe('update', () => {
    it('should throw an error when updating a non-existent template', async () => {
      // Create a new template that hasn't been saved
      const nonExistentTemplate = new RollTemplateEntity(
        'non-existent-template',
        'Non-existent Template',
        'A template that does not exist',
        new RollTemplate('This template does not exist'),
      );

      await expect(repository.update(nonExistentTemplate)).rejects.toThrow(
        `Template with ID ${nonExistentTemplate.id} does not exist`,
      );
    });

    it('should update an existing template', async () => {
      // First save the template
      await repository.save(sampleTemplate);

      // Create an updated version of the template
      const updatedTemplate = new RollTemplateEntity(
        sampleTemplate.id,
        'Updated Template',
        'An updated template description',
        new RollTemplate('This is an updated template'),
      );

      // Update the template
      await repository.update(updatedTemplate);

      // Verify the template was updated
      const result = await repository.getById(sampleTemplate.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(updatedTemplate.id);
      expect(result?.name).toBe(updatedTemplate.name);
      expect(result?.description).toBe(updatedTemplate.description);
      expect(result?.template.toString()).toBe(updatedTemplate.template.toString());
    });
  });

  describe('list', () => {
    beforeEach(async () => {
      // Clear the repository
      repository.clear();

      // Add sample templates
      await repository.save(sampleTemplate);

      await repository.save(
        new RollTemplateEntity(
          'test-2',
          'Another Template',
          'Another template for testing',
          new RollTemplate('This is another template'),
        ),
      );

      await repository.save(
        new RollTemplateEntity(
          'test-3',
          'Test Template',
          'A third template with the same name as the first',
          new RollTemplate('This is a third template'),
        ),
      );
    });

    it('should list all templates when no filter is provided', async () => {
      const templates = await repository.list();

      expect(templates.length).toBe(3);
      expect(templates.map(t => t.id).sort()).toEqual(['test-1', 'test-2', 'test-3'].sort());
    });

    it('should filter templates by property', async () => {
      const templates = await repository.list({ name: 'Test Template' });

      expect(templates.length).toBe(2);
      expect(templates.map(t => t.id).sort()).toEqual(['test-1', 'test-3'].sort());
    });

    it('should support filtering by nested properties', async () => {
      const templates = await repository.list({
        'template.template': 'This is a {{test::table-id::table-name}} template',
      });

      expect(templates.length).toBe(1);
      expect(templates[0].id).toBe('test-1');
    });

    it('should return an empty array when no templates match the filter', async () => {
      const templates = await repository.list({ name: 'Non-existent Template' });

      expect(templates.length).toBe(0);
    });

    it('should handle special case for array length', async () => {
      // This test is a bit contrived since RollTemplateEntity doesn't have array properties,
      // but it tests the functionality in the list method

      // Mock an array property for testing
      const mockTemplate = {
        id: 'mock-template',
        name: 'Mock Template',
        description: 'A mock template',
        template: { template: 'Mock template content' },
        items: ['item1', 'item2', 'item3'],
      };

      // @ts-ignore - We're intentionally adding a non-standard property for testing
      repository['templates'].set('mock-template', mockTemplate);

      // Filter by the length of the items array
      const templates = await repository.list({ 'items.length': 3 });

      expect(templates.length).toBe(1);
      expect(templates[0].id).toBe('mock-template');
    });
  });

  describe('delete', () => {
    it('should throw an error when deleting a non-existent template', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow(
        'Template with ID non-existent does not exist',
      );
    });

    it('should delete an existing template', async () => {
      // First save the template
      await repository.save(sampleTemplate);

      // Verify it exists
      expect(await repository.getById(sampleTemplate.id)).not.toBeNull();

      // Delete the template
      await repository.delete(sampleTemplate.id);

      // Verify it no longer exists
      expect(await repository.getById(sampleTemplate.id)).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove all templates from the repository', async () => {
      // Add some templates
      await repository.save(sampleTemplate);
      await repository.save(
        new RollTemplateEntity(
          'test-2',
          'Another Template',
          'Another template for testing',
          new RollTemplate('This is another template'),
        ),
      );

      // Verify templates exist
      expect((await repository.list()).length).toBe(2);

      // Clear the repository
      repository.clear();

      // Verify no templates remain
      expect((await repository.list()).length).toBe(0);
    });
  });
});
