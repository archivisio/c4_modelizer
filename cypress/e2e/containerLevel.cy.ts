describe('C4 Modelizer - Container Level', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.importModel('container.json')
    cy.url().should('include', '/container')
  })

  it('should include container level', () => {
    cy.get('body').should('contain', 'Systems')
    cy.get('body').should('contain', 'Containers')
    cy.get('body').should('not.contain', 'Components')
    cy.get('body').should('not.contain', 'Code')
  })

  it('should add a node and modify its name inline', () => {
    const node = cy.addNode()
    cy.editNodeNameInline(node, 'Custom Container Name')
    node.get('[data-testid=block-title]').should('contain', 'Custom Container Name')
  })

  it('should add a node and modify its name', () => {
    cy.addNode()
    cy.editNodeProperty('name', 'Custom Container Name')
    cy.get('.react-flow__node').contains('Custom Container Name')
  })

  it('should add a node and modify its description', () => {
    cy.addNode()
    cy.editNodeProperty('description', 'This is a custom container description')

    cy.get('.react-flow__node').first().click()
    cy.get('.MuiTypography-body2').should('be.visible')
    cy.get('.MuiTypography-body2').contains('This is a custom container description')
  })

  it('should add a node and modify its technology', () => {
    cy.addNode()
    cy.get('.react-flow__node').first().click()
    cy.editNodeProperty('technology', 'postgresql')
    cy.get('.react-flow__node').find('[data-testid^="technology_icon_postgresql"]').should('be.visible')
  })

  it('should add a node and modify its url', () => {
    cy.addNode()
    cy.editNodeProperty('url', 'https://example.com/container')

    cy.get('.react-flow__node').first().click()
    cy.get('[data-testid=OpenInNewIcon]').should('be.visible')
  })

  it('should add two nodes and connect them', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'REST API')
  })

  it('should edit the name of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'REST API')

    cy.editConnectionProperty('label', 'Send data')
    cy.get('.react-flow__edgelabel-renderer').should('contain', 'Send data')
  })

  it('should edit the technology of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'REST API')

    cy.editConnectionProperty('technology', 'HTTP')
    cy.get('[data-testid^="technology_icon_http"]').should('be.visible')
  })

  it('should delete a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'REST API')

    cy.deleteConnection()
  })

  it('should delete nodes', () => {
    const node = cy.addNode()
    cy.deleteNode(node)
    cy.get('.react-flow__node').should('not.exist')
  })
})
