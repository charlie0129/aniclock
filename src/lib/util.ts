export function atLeastFullSecond() {
	return new Promise<string>(async (resolve, reject) => {
		const nextSec = Math.floor((Date.now() + 1000) / 1000) * 1000;
		for (let i = 0; i < 2000; i++) {
			const now = Date.now();
			if (now > nextSec) {
				resolve('');
				return;
			}
			await new Promise((res) => setTimeout(res, 1));
		}
		reject('timeout');
	});
}
