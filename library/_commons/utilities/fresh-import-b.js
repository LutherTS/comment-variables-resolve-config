try {
  const module = await import(process.env.MODULE_TO_LOAD);
  process.send({ module });
} catch {
  process.send({ module: null });
}
