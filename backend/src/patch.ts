import v8 from "node:v8"

try {
  const v8Any = v8 as any
  if (v8Any.startupSnapshot) {
    if (typeof v8Any.startupSnapshot.isBuildingSnapshot !== "function") {
      v8Any.startupSnapshot.isBuildingSnapshot = () => false
    }
  } else {
    v8Any.startupSnapshot = { isBuildingSnapshot: () => false }
  }

  if (typeof (process as any)?.getBuiltinModule === "function") {
    const orig = (process as any).getBuiltinModule.bind(process)
    try {
      ;(process as any).getBuiltinModule = (name: string) => {
        if (name === "v8") {
          return v8Any
        }
        return orig(name)
      }
    } catch {}
  }
} catch {}

