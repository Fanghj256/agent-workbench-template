import plugin from '../plugin/index.js';

const tools = new Map();
const ctx = {
  tool: {
    transform: async (fn) => {
      fn({
        namespace: () => undefined,
        add: (tool) => tools.set(tool.name, tool),
      });
    },
  },
};

await plugin.setup(ctx);
console.log('tools:', [...tools.keys()].join(', '));

const list = await tools.get('list').execute({ limit: 3 });
const listData = JSON.parse(list.content);
console.log('list total:', listData.total, 'returned:', listData.returned);

const read = await tools.get('read').execute({ doc_id: 'ex-001' });
const readData = JSON.parse(read.content);
console.log('read:', readData.doc_id, readData.title, 'content length:', readData.content.length);

const report = await tools.get('library_read').execute({ doc_id: 'report-001' });
const reportData = JSON.parse(report.content);
console.log('report:', reportData.doc_id, reportData.title, 'content length:', reportData.content.length);

const search = await tools.get('library_search').execute({ query: '智能', limit: 5 });
const searchData = JSON.parse(search.content);
console.log('search total:', searchData.total, 'returned:', searchData.returned);
