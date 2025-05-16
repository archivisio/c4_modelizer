/// <reference types="cypress" />
import '@4tw/cypress-drag-drop';
import 'cypress-file-upload';

/**
 * Add a new node to the diagram by clicking on the add button
 */
Cypress.Commands.add('addNode', () => {
  const nodeId = `node-${Date.now()}`;
  cy.get('[data-testid=toolbar-add-system]').click();
  cy.get('.react-flow__node').should('exist');
  cy.wait(300);
  cy.get('.react-flow__controls-fitview').click();

  cy.get('.react-flow__node').then($nodes => {
    const $newNode = Cypress.$.makeArray($nodes).find(node => !Cypress.$(node).attr('data-node-id'));
    if ($newNode) {
      Cypress.$($newNode).attr('data-node-id', nodeId);
    }
  });

  return cy.get(`[data-node-id=${nodeId}]`);
});

Cypress.Commands.add('moveNode', (node, x, y) => {
  node.move({ deltaX: x, deltaY: y, force: true });

  cy.wait(300);
  return node;
});

/**
 * Fix view
 * @example cy.fitView()
 */
Cypress.Commands.add('fitView', () => {
  return cy.get('.react-flow__controls-fitview').click();
});

/**
 * Export model as JSON and verify that download is triggered
 */
Cypress.Commands.add('exportModel', () => {
  cy.window().then((win) => {
    cy.stub(win.document, 'createElement').callThrough().withArgs('a').callsFake((element) => {
      const a = document.createElement(element);
      cy.spy(a, 'click').as('downloadClick');
      return a;
    });
  });

  cy.get('[data-testid=toolbar-export-model]').click();
  return cy.get('@downloadClick').should('be.called');
});

/**
 * Reset store by clicking on delete button and confirming
 */
Cypress.Commands.add('resetStore', () => {
  cy.get('[data-testid=toolbar-reset-model]').click();
  cy.get('[data-testid=confirm-button]').click();
  return cy.get('.react-flow__node').should('not.exist');
});

/**
 * Import from fixture
 * @param {string} fixturePath - Path of the fixture file to import
 */
Cypress.Commands.add('importModel', (fixturePath: string) => {
  cy.get('[data-testid=toolbar-import-model]').click();
  cy.get('[data-testid=toolbar-file-input]').attachFile(fixturePath);
  cy.wait(500);
});

/**
 * Add a node and modify its name inline
 */
Cypress.Commands.add('editNodeNameInline', (node, newName) => {
  node.get('[data-testid=block-title]').click()
  node.get('[data-testid=block-title-input]').clear().type(newName).type('{enter}')
})

/**
 * Edit node properties
 * @param {string} property - Property to edit (name, description, technology, url)
 * @param {string} value - New value for the property
 */
Cypress.Commands.add('editNodeProperty', (property: string, value: string) => {
  cy.get('.react-flow__node').first().find('[data-testid=EditIcon]').parent().click();
  cy.get('.MuiDialog-root').should('be.visible');
  if (property === 'technology') {
    cy.get(`[data-testid=input_${property}]`).clear().type(value[0]);
    cy.get(`[data-testid=technology_option_${value}]`).click();
  } else {
    cy.get(`[data-testid=input_${property}]`).clear().type(value);
  }
  cy.get('[data-testid=dialog-save-button]').click();

  cy.wait(300);
  return cy.get('.react-flow__node');
});

/**
 * Create a connection between two nodes
 * @param {Chainable<JQuery<HTMLElement>>} sourceNode - Source node
 * @param {Chainable<JQuery<HTMLElement>>} targetNode - Target node
 * @param {string} name - Name of the connection
 * @example cy.connectNodes(cy.get('[data-node-id=node1]'), cy.get('[data-node-id=node2]'), 'API Connection')
 */
Cypress.Commands.add('connectNodes', (sourceNode, targetNode, name) => {
  sourceNode.find('[data-testid^="source-"]').first().as('sourceHandle');
  targetNode.find('[data-testid^="target-"]').first().as('targetHandle');

  cy.get('@sourceHandle').drag('@targetHandle', { force: true })
  cy.get('@targetHandle').click({ force: true });

  cy.get('.MuiDialog-root').should('be.visible');

  cy.get(`[data-testid=input_label]`).clear().type(name);
  cy.get('[data-testid=dialog-save-button]').click();

  cy.wait(500);
  cy.get('.react-flow__controls-fitview').click();
  return cy.get('.react-flow__edge').should('exist');
});

/**
 * Edit connection properties
 * @param {string} property - Property to edit (label, technology)
 * @param {string} value - New value for the property
 */
Cypress.Commands.add('editConnectionProperty', (property: string, value: string) => {
  cy.get('[data-testid^="rf__edge-"], .react-flow__edge').first().click({ force: true });
  cy.get('.MuiDialog-root').should('be.visible');

  switch (property) {
    case 'label':
      cy.get('.MuiDialog-root input')
        .first()
        .clear()
        .type(value, { delay: 20 });
      break;
    case 'technology':
      cy.get('.MuiDialog-root .MuiAutocomplete-input')
        .clear()
        .type(value, { delay: 20 });
      cy.get('.MuiAutocomplete-popper li').first().click({ force: true });
      break;
  }

  cy.get('[data-testid=dialog-save-button]').click();
  cy.wait(300);

  return cy.get('.react-flow__edge');
});

/**
 * Delete a connection
 */
Cypress.Commands.add('deleteConnection', () => {
  cy.get('.react-flow__edge').first().click({ force: true });
  cy.get('.MuiDialog-root').should('be.visible');
  cy.get('[data-testid=dialog-delete-button]').click();
  cy.get('[data-testid=confirm-dialog]').should('be.visible');
  cy.get('[data-testid=confirm-button]').click();
  cy.wait(500);
  cy.get('.react-flow__controls-fitview').click();

  return cy.get('.react-flow__edge').should('not.exist');
});

/**
 * Delete a node
 */
Cypress.Commands.add('deleteNode', (node) => {
  node.find('[data-testid=EditIcon]').parent().click();
  cy.get('.MuiDialog-root').should('be.visible');
  cy.get('[data-testid=dialog-delete-button]').click();
  cy.get('[data-testid=confirm-dialog]').should('be.visible');
  cy.get('[data-testid=confirm-button]').click();

  cy.wait(300);

  return cy.get('.react-flow__node').should('have.length.lessThan', 2);
});

/* eslint-disable */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Add a new node to the diagram by clicking on the add button
       * @example cy.addNode()
       */
      addNode(): Chainable<JQuery<HTMLElement>>;

      /**
       * Move a node
       * @example cy.moveNode(node, x, y)
       */
      moveNode(node: Chainable<JQuery<HTMLElement>>, x: number, y: number)

      /**
       * Fix view
       * @example cy.fitView()
       */
      fitView(): Chainable<JQuery<HTMLElement>>;

      /**
       * Export model as JSON
       * @example cy.exportModel()
       */
      exportModel(): Chainable<JQuery<HTMLElement>>;

      /**
       * Reset store by clicking on delete button and confirming
       * @example cy.resetStore()
       */
      resetStore(): Chainable<JQuery<HTMLElement>>;

      /**
       * Import from fixture
       * @param {string} fixturePath - Path of the fixture file to import
       * @example cy.importModel('basicModel-v2.json')
       */
      importModel(fixturePath: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Edit node name inline
       * @param {Chainable<JQuery<HTMLElement>>} node - Node to edit
       * @param {string} newName - New name for the node
       * @example cy.editNodeNameInline(cy.get('.react-flow__node').first(), 'New System Name')
       */
      editNodeNameInline(node: Chainable<JQuery<HTMLElement>>, newName: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Edit node properties
       * @param {string} property - Property to edit (name, description, technology, url)
       * @param {string} value - New value for the property
       * @example cy.editNodeProperty('name', 'New System Name')
       */
      editNodeProperty(property: string, value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Create a connection between two nodes
       * @param {Chainable<JQuery<HTMLElement>>} sourceNode - Source node
       * @param {Chainable<JQuery<HTMLElement>>} targetNode - Target node
       * @param {string} name - Name of the connection
       * @example cy.connectNodes(cy.get('[data-testid=node]'), cy.get('[data-testid=node]'), 'API Connection')
       */
      connectNodes(sourceNode: Chainable<JQuery<HTMLElement>>, targetNode: Chainable<JQuery<HTMLElement>>, name: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Edit connection properties
       * @param {string} property - Property to edit (label, technology)
       * @param {string} value - New value for the property
       * @example cy.editConnectionProperty('label', 'API Connection')
       */
      editConnectionProperty(property: string, value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Delete a connection
       * @example cy.deleteConnection()
       */
      deleteConnection(): Chainable<JQuery<HTMLElement>>;

      /**
       * Delete a node
       * @example cy.deleteNode()
       */
      deleteNode(node: Chainable<JQuery<HTMLElement>>): Chainable<JQuery<HTMLElement>>;
    }
  }
}