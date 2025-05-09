import { CodeBlock, ComponentBlock, ContainerBlock, SystemBlock } from "@interfaces/c4"
import { FlatC4Model, useFlatC4Store } from "@store/flatC4Store"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!global.crypto) global.crypto = { randomUUID: () => Math.random().toString(36).slice(2) }

const systemFactory = (properties: { [key: string]: string }): SystemBlock => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  position: { x: 0, y: 0 },
  technology: "",
  url: "",
  connections: [],
  ...properties,
  type: "system",
})

const containerFactory = (properties: { [key: string]: string }): ContainerBlock => ({
  id: crypto.randomUUID(),
  systemId: "",
  name: "",
  description: "",
  position: { x: 0, y: 0 },
  technology: "",
  url: "",
  connections: [],
  ...properties,
  type: "container",
})

const componentFactory = (properties: { [key: string]: string }): ComponentBlock => ({
  id: crypto.randomUUID(),
  systemId: "",
  containerId: "",
  name: "",
  description: "",
  position: { x: 0, y: 0 },
  technology: "",
  url: "",
  connections: [],
  ...properties,
  type: "component",
})

const codeElementFactory = (properties: { [key: string]: string }): CodeBlock => ({
  id: crypto.randomUUID(),
  systemId: "",
  containerId: "",
  componentId: "",
  name: "",
  description: "",
  position: { x: 0, y: 0 },
  technology: "",
  codeType: "class",
  code: "",
  url: "",
  connections: [],
  ...properties,
  type: "code",
})

describe("flatC4Store", () => {
  const reset = () => {
    useFlatC4Store.setState({
      model: {
        systems: [],
        containers: [],
        components: [],
        codeElements: [],
        viewLevel: "system"
      }
    })
  }

  beforeEach(reset)

  it("handles systems", () => {
    const { addSystem, updateSystem, removeSystem, connectSystems } = useFlatC4Store.getState()
    addSystem({ name: "System A", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<SystemBlock, "id" | "containers">)
    addSystem({ name: "System B", description: "", position: { x: 1, y: 1 }, technology: "", url: "" } as Omit<SystemBlock, "id" | "containers">)
    const { systems } = useFlatC4Store.getState().model
    const idA = systems[0].id
    const idB = systems[1].id
    updateSystem(idA, { name: "System A+" })
    expect(useFlatC4Store.getState().model.systems[0].name).toBe("System A+")
    connectSystems(idA, { targetId: idB })
    expect(useFlatC4Store.getState().model.systems[0].connections).toHaveLength(1)
    removeSystem(idB)
    expect(useFlatC4Store.getState().model.systems).toHaveLength(1)
  })

  it("handles containers", () => {
    const { addSystem, addContainer, updateContainer, removeContainer, connectContainers } = useFlatC4Store.getState()
    addSystem({ name: "Sys", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<SystemBlock, "id" | "containers">)
    const sysId = useFlatC4Store.getState().model.systems[0].id
    addContainer(sysId, { name: "C1", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<ContainerBlock, "id" | "components" | "systemId">)
    addContainer(sysId, { name: "C2", description: "", position: { x: 1, y: 1 }, technology: "", url: "" } as Omit<ContainerBlock, "id" | "components" | "systemId">)
    const { containers } = useFlatC4Store.getState().model
    const c1 = containers[0].id
    const c2 = containers[1].id
    updateContainer(c1, { name: "C1+" })
    expect(useFlatC4Store.getState().model.containers[0].name).toBe("C1+")
    connectContainers(c1, { targetId: c2 })
    expect(useFlatC4Store.getState().model.containers[0].connections).toHaveLength(1)
    removeContainer(c2)
    expect(useFlatC4Store.getState().model.containers).toHaveLength(1)
  })

  it("handles components", () => {
    const { addSystem, addContainer, addComponent, updateComponent, removeComponent, connectComponents } = useFlatC4Store.getState()
    addSystem({ name: "S", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<SystemBlock, "id" | "containers">)
    const sId = useFlatC4Store.getState().model.systems[0].id
    addContainer(sId, { name: "C", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<ContainerBlock, "id" | "components" | "systemId">)
    const cId = useFlatC4Store.getState().model.containers[0].id
    addComponent(cId, { name: "P1", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<ComponentBlock, "id" | "systemId" | "codeElements" | "containerId">)
    addComponent(cId, { name: "P2", description: "", position: { x: 1, y: 1 }, technology: "", url: "" } as Omit<ComponentBlock, "id" | "systemId" | "codeElements" | "containerId">)
    const { components } = useFlatC4Store.getState().model
    const p1 = components[0].id
    const p2 = components[1].id
    updateComponent(p1, { name: "P1+" })
    expect(useFlatC4Store.getState().model.components[0].name).toBe("P1+")
    connectComponents(p1, { targetId: p2 })
    expect(useFlatC4Store.getState().model.components[0].connections).toHaveLength(1)
    removeComponent(p2)
    expect(useFlatC4Store.getState().model.components).toHaveLength(1)
  })

  it("handles code elements", () => {
    const { addSystem, addContainer, addComponent, addCodeElement, updateCodeElement, removeCodeElement, connectCodeElements } = useFlatC4Store.getState()
    addSystem({ name: "S", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<SystemBlock, "id" | "containers">)
    const sId = useFlatC4Store.getState().model.systems[0].id
    addContainer(sId, { name: "C", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<ContainerBlock, "id" | "components" | "systemId">)
    const cId = useFlatC4Store.getState().model.containers[0].id
    addComponent(cId, { name: "P", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<ComponentBlock, "id" | "systemId" | "codeElements" | "containerId">)
    const pId = useFlatC4Store.getState().model.components[0].id
    addCodeElement(pId, { name: "E1", description: "", position: { x: 0, y: 0 }, technology: "", codeType: "class", code: "", url: "" } as Omit<CodeBlock, "id" | "systemId" | "containerId" | "componentId">)
    addCodeElement(pId, { name: "E2", description: "", position: { x: 1, y: 1 }, technology: "", codeType: "class", code: "", url: "" } as Omit<CodeBlock, "id" | "systemId" | "containerId" | "componentId">)
    const { codeElements } = useFlatC4Store.getState().model
    const e1 = codeElements[0].id
    const e2 = codeElements[1].id
    updateCodeElement(e1, { name: "E1+" })
    expect(useFlatC4Store.getState().model.codeElements[0].name).toBe("E1+")
    connectCodeElements(e1, { targetId: e2 })
    expect(useFlatC4Store.getState().model.codeElements[0].connections).toHaveLength(1)
    removeCodeElement(e2)
    expect(useFlatC4Store.getState().model.codeElements).toHaveLength(1)
  })

  it("updates and removes connections generically", () => {
    const { addSystem, connectSystems, updateConnection, removeConnection } = useFlatC4Store.getState()
    addSystem({ name: "A", description: "", position: { x: 0, y: 0 }, technology: "", url: "" } as Omit<SystemBlock, "id" | "containers">)
    addSystem({ name: "B", description: "", position: { x: 1, y: 1 }, technology: "", url: "" } as Omit<SystemBlock, "id" | "containers">)
    const { systems } = useFlatC4Store.getState().model
    const idA = systems[0].id
    const idB = systems[1].id
    connectSystems(idA, { targetId: idB, label: "L" })
    updateConnection("system", idA, idB, { label: "X" })
    expect(useFlatC4Store.getState().model.systems[0].connections[0].label).toBe("X")
    removeConnection("system", idA, idB)
    expect(useFlatC4Store.getState().model.systems[0].connections).toHaveLength(0)
  })

  it("navigates between levels", () => {
    const { setActiveSystem, setActiveContainer, setActiveComponent, setViewLevel } = useFlatC4Store.getState()
    setViewLevel("system")
    expect(useFlatC4Store.getState().model.viewLevel).toBe("system")
    setActiveSystem("sys")
    expect(useFlatC4Store.getState().model.viewLevel).toBe("container")
    setActiveContainer("cont")
    expect(useFlatC4Store.getState().model.viewLevel).toBe("component")
    setActiveComponent("comp")
    expect(useFlatC4Store.getState().model.viewLevel).toBe("code")
    setViewLevel("system")
    expect(useFlatC4Store.getState().model.activeSystemId).toBeUndefined()
  })

  it("replaces the whole model", () => {
    const { setModel } = useFlatC4Store.getState()
    setModel({ systems: [], containers: [], components: [], codeElements: [], viewLevel: "system" } as FlatC4Model)
    expect(useFlatC4Store.getState().model.systems).toHaveLength(0)
  })

  it("propagates updates from system to container copy and removes copies on deletion", () => {
    const { addSystem, addContainer, updateSystem, removeSystem } = useFlatC4Store.getState();

    addSystem(systemFactory({ name: "Original System" }));
    const sysId = useFlatC4Store.getState().model.systems[0].id;

    addContainer(sysId, containerFactory({ name: "Copy Container", original: { id: sysId }, systemId: sysId }));
    updateSystem(sysId, { name: "Updated System" });

    const containerCopy = useFlatC4Store.getState().model.containers.find(c => c.original?.id === sysId);
    expect(containerCopy?.name).toBe("Updated System");

    removeSystem(sysId);
    const remainingContainers = useFlatC4Store.getState().model.containers.filter(c => c.original?.id === sysId);
    expect(remainingContainers).toHaveLength(0);
  });

  it("propagates updates from container to component copy and removes copies on deletion", () => {
    const { addSystem, addContainer, addComponent, updateContainer, removeContainer } = useFlatC4Store.getState();

    addSystem(systemFactory({ name: "S" }));
    const sysId = useFlatC4Store.getState().model.systems[0].id;

    addContainer(sysId, containerFactory({ name: "Original Container", systemId: sysId }));
    const contId = useFlatC4Store.getState().model.containers[0].id;

    addComponent(contId, componentFactory({ name: "Copy Component", original: { id: contId }, systemId: sysId, containerId: contId }));
    updateContainer(contId, { name: "Container+" });

    const compCopy = useFlatC4Store.getState().model.components.find(c => c.original?.id === contId);
    expect(compCopy?.name).toBe("Container+");

    removeContainer(contId);
    const remainingComponents = useFlatC4Store.getState().model.components.filter(c => c.original?.id === contId);
    expect(remainingComponents).toHaveLength(0);
  });

  it("propagates updates from component to code copy and removes copies on deletion", () => {
    const { addSystem, addContainer, addComponent, addCodeElement, updateComponent, removeComponent } = useFlatC4Store.getState();

    addSystem(systemFactory({ name: "Sys" }));
    const sysId = useFlatC4Store.getState().model.systems[0].id;

    addContainer(sysId, containerFactory({ name: "Cont", systemId: sysId }));
    const contId = useFlatC4Store.getState().model.containers[0].id;

    addComponent(contId, componentFactory({ name: "Original Component", systemId: sysId, containerId: contId }));
    const compId = useFlatC4Store.getState().model.components[0].id;

    addCodeElement(compId, codeElementFactory({ name: "Copy Code", original: { id: compId }, systemId: sysId, containerId: contId, componentId: compId }));
    updateComponent(compId, { name: "Component X" });

    const codeCopy = useFlatC4Store.getState().model.codeElements.find(c => c.original?.id === compId);
    expect(codeCopy?.name).toBe("Component X");

    removeComponent(compId);
    const remainingCodes = useFlatC4Store.getState().model.codeElements.filter(c => c.original?.id === compId);
    expect(remainingCodes).toHaveLength(0);
  });
})
