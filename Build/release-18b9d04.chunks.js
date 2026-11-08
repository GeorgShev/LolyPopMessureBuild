// Generated delivery adapter: stream the original Unity data from Git-sized parts.
(() => {
  const originalFetch = globalThis.fetch.bind(globalThis);
  const dataUrl = new URL('Build/release-18b9d04.data.unityweb', document.baseURI).href;
  const parts = [{"name":"release-18b9d04.data.part00","size":33554432},{"name":"release-18b9d04.data.part01","size":33554432},{"name":"release-18b9d04.data.part02","size":33554432},{"name":"release-18b9d04.data.part03","size":33554432},{"name":"release-18b9d04.data.part04","size":2706973}];
  globalThis.fetch = async (input, options) => {
    const url = new URL(input instanceof Request ? input.url : String(input), document.baseURI).href;
    if (url !== dataUrl) return originalFetch(input, options);
    const headers = {'Content-Type':'application/octet-stream', 'Content-Length':'136924701'};
    const method = options?.method || (input instanceof Request ? input.method : 'GET');
    let reader, index = 0, received = 0;
    const stream = method === 'HEAD' ? null : new ReadableStream({
      async pull(controller) {
        try {
          while (true) {
            if (!reader) {
              if (index === parts.length) { controller.close(); return; }
              const part = parts[index];
              const response = await originalFetch(new URL('Build/' + part.name, document.baseURI), options);
              if (!response.ok) throw new Error('Game download failed: ' + response.status + ' ' + part.name);
              reader = response.body.getReader(); received = 0;
            }
            const next = await reader.read();
            if (next.done) {
              if (received !== parts[index].size) throw new Error('Incomplete game download: ' + parts[index].name);
              reader.releaseLock(); reader = null; index++; continue;
            }
            received += next.value.byteLength; controller.enqueue(next.value); return;
          }
        } catch (error) { controller.error(error); }
      },
      cancel(reason) { return reader?.cancel(reason); }
    });
    const response = new Response(stream, {status:200, headers});
    Object.defineProperty(response, 'url', {value:dataUrl});
    return response;
  };
})();
