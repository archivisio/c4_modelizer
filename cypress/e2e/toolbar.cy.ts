describe('C4 Modelizer - Toolbar', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should add a new node when clicking the add button', () => {
    cy.get('.react-flow__node').should('not.exist')
    cy.addNode().contains('New system')
  })

  it('should export the model as JSON', () => {
    cy.addNode()
    cy.exportModel()
  })

  it('should reset the store when clicking the reset button and confirming', () => {
    cy.addNode()
    cy.resetStore()
  })

  it('should import a model from JSON file', () => {
    cy.importModel('basicModel-v2.json')
    cy.get('.react-flow__node').contains('Test system')
  })
})