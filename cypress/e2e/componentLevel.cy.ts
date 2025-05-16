describe('C4 Modelizer - Component Level', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.importModel('component.json')
    cy.url().should('include', '/component')
  })

  it('should include component level', () => {
    cy.get('body').should('contain', 'Systems')
    cy.get('body').should('contain', 'Containers')
    cy.get('body').should('contain', 'Components')
    cy.get('body').should('not.contain', 'Code')
  })

  it('should add a node and modify its name inline', () => {
    const node = cy.addNode()
    cy.editNodeNameInline(node, 'Custom Component Name')
    node.get('[data-testid=block-title]').should('contain', 'Custom Component Name')
  })

  it('should add a node and modify its name', () => {
    cy.addNode()

    cy.editNodeProperty('name', 'Custom Component Name')
    cy.get('.react-flow__node').contains('Custom Component Name')
  })

  it('should add a node and modify its description', () => {
    cy.addNode()

    cy.editNodeProperty('description', 'This is a custom component description')

    cy.get('.react-flow__node').first().click()
    cy.get('.MuiTypography-body2').should('be.visible')
    cy.get('.MuiTypography-body2').contains('This is a custom component description')
  })

  it('should add a node and modify its technology', () => {
    cy.addNode()

    cy.get('.react-flow__node').first().click()
    cy.editNodeProperty('technology', 'react')
    cy.get('.react-flow__node').find('[data-testid^="technology_icon_react"]').should('be.visible')
  })

  it('should add a node and modify its url', () => {
    cy.addNode()
    cy.editNodeProperty('url', 'https://example.com/component')

    cy.get('.react-flow__node').first().click()
    cy.get('[data-testid=OpenInNewIcon]').should('be.visible')
  })

  it('should add two nodes and connect them', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'Method Call')
  })

  it('should edit the name of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()


    cy.connectNodes(node2, node1, 'Method Call')
    cy.editConnectionProperty('label', 'API Request')
    cy.get('.react-flow__edgelabel-renderer').should('contain', 'API Request')
  })

  it('should edit the technology of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'Method Call')
    cy.editConnectionProperty('technology', 'Redis')
    cy.get('[data-testid^="technology_icon_redis"]').should('be.visible')
  })

  it('should delete a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'Method Call')
    cy.deleteConnection()
  })

  it('should delete nodes', () => {
    const node = cy.addNode()

    cy.deleteNode(node)
    cy.get('.react-flow__node').should('not.exist')
  })
})
