describe('C4 Modelizer - Code Level', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.importModel('code.json')
    cy.url().should('include', '/code')
  })

  it('should include code level', () => {
    cy.get('body').should('contain', 'systems')
    cy.get('body').should('contain', 'containers')
    cy.get('body').should('contain', 'components')
    cy.get('body').should('contain', 'code')
  })

  it('should add a code block and modify its name', () => {
    cy.addNode()
    cy.editNodeProperty('name', 'Custom Code Name')
    cy.get('.react-flow__node').contains('Custom Code Name')
  })

  it('should add a code block and modify its description', () => {
    cy.addNode()
    cy.editNodeProperty('description', 'This is a custom code description')

    cy.get('.react-flow__node').first().click()
    cy.get('.MuiTypography-body2').should('be.visible')
    cy.get('.MuiTypography-body2').contains('This is a custom code description')
  })

  it('should add a code block and modify its code type', () => {
    cy.addNode()
    cy.get('.react-flow__node').first().click()
    // Ouvre la boîte de dialogue d'édition via aria-label
    cy.get('.react-flow__node').first().find('button[aria-label="edit"]').click()
    // Sélection du type via le combobox
    cy.get('[data-testid="input_type"] [role="combobox"]').click()
    cy.get('li[data-value="function"]').click()
    // Sauvegarde
    cy.get('[data-testid="dialog-save-button"]').click()
    // Vérification de la présence du chip 'function'
    cy.get('.react-flow__node').first().find('.MuiChip-label').contains('function')
  })

  it('should add a code block and modify its language', () => {
    cy.addNode()
    cy.get('.react-flow__node').first().click()
    cy.get('.react-flow__node').first().find('button[aria-label="edit"]').click()
    cy.get('[data-testid="input_technology"] input').focus().type('typescript')
    cy.get('li[data-option-index="0"]').click()
    cy.get('[data-testid="dialog-save-button"]').click()
    cy.get('.react-flow__node').find('[data-testid^="technology_icon_typescript"]').should('be.visible')
  })

  it('should add a code block and modify its code content', () => {
    cy.addNode()
    cy.get('.react-flow__node').first().click()
    cy.get('.react-flow__node').first().find('button[aria-label="edit"]').click()
    cy.wait(100)
    cy.get('[data-testid="input_code"]')
      .click()

    cy.get('[data-testid="input_code"]')
      .find('textarea')
      .first()
      .type('hello world', { delay: 0 })
      .should('contain.text', 'hello world')
  })

  it('should add a code block and modify its url', () => {
    cy.addNode()
    cy.editNodeProperty('url', 'https://example.com/code')

    cy.get('.react-flow__node').first().click()
    cy.get('[data-testid=OpenInNewIcon]').should('be.visible')
  })

  it('should add two code blocks and connect them', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'Import')
  })

  it('should edit the name of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'Import')

    cy.editConnectionProperty('label', 'Extends')
    cy.get('.react-flow__edgelabel-renderer').should('contain', 'Extends')
  })

  it('should edit the technology of a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'Import')

    cy.editConnectionProperty('technology', 'JavaScript')
    cy.get('[data-testid^="technology_icon_javascript"]').should('be.visible')
  })

  it('should delete a connection', () => {
    const node1 = cy.addNode()
    const node2 = cy.addNode()

    cy.connectNodes(node2, node1, 'Import')

    cy.deleteConnection()
  })

  it('should delete code blocks', () => {
    const node = cy.addNode()
    cy.deleteNode(node)
    cy.get('.react-flow__node').should('not.exist')
  })
})
