describe('C4 Modelizer - System Level', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should include system level', () => {
    cy.get('body').should('contain', 'systems')
    cy.get('body').should('not.contain', 'containers')
    cy.get('body').should('not.contain', 'components')
    cy.get('body').should('not.contain', 'code')
  })

  it('should add a node and modify its name', () => {
    cy.addNode()
    cy.editNodeProperty('name', 'Custom System Name')
    cy.get('.react-flow__node').contains('Custom System Name')
  })

  it('should add a node and modify its description', () => {
    cy.addNode()
    cy.editNodeProperty('description', 'This is a custom system description')

    cy.get('.react-flow__node').first().click()
    cy.get('.MuiTypography-body2').should('be.visible')
    cy.get('.MuiTypography-body2').contains('This is a custom system description')
  })

  it('should add a node and modify its technology', () => {
    cy.addNode()
    cy.get('.react-flow__node').first().click()
    cy.editNodeProperty('technology', 'aws')
    cy.get('.react-flow__node').find('[data-testid^="technology_icon_aws"]').should('be.visible')
  })

  it('should add a node and modify its url', () => {
    cy.addNode()
    cy.editNodeProperty('url', 'https://example.com')

    cy.get('.react-flow__node').first().click()
    cy.get('[data-testid=OpenInNewIcon]').should('be.visible')
  })

  it('should add two nodes and connect them', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'API Connection')
  })

  it('should edit the name of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'API Connection')

    cy.editConnectionProperty('label', 'New API Connection')
    cy.get('.react-flow__edgelabel-renderer').should('contain', 'New API Connection')
  })

  it('should edit the technology of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'API Connection')

    cy.editConnectionProperty('technology', 'Amazon')
    cy.get('[data-testid^="technology_icon_amazonsqs"]').should('be.visible')
  })

  it('should delete a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'API Connection')

    cy.deleteConnection()
  })

  it('should delete nodes', () => {
    const node = cy.addNode()
    cy.deleteNode(node)
    cy.get('.react-flow__node').should('not.exist')
  })
})