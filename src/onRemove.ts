export function onRemove(id, nodes) {
	return nodes.filter((node) => node.id !== id);
}
