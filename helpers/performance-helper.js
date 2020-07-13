class PerformanceHelper {
	static perfMeasure(measureName, startMark, endMark) {
		if (!window.performance || !window.performance.measure || !window.performance.getEntriesByName || window.performance.getEntriesByName(measureName).length) {
			return;
		}

		window.performance.measure(measureName, startMark, endMark);
		this.clearMarks([startMark, endMark]);
	}

	static clearMeasure(measureName) {
		if (!window.performance || !window.performance.clearMeasures) {
			return;
		}

		window.performance.clearMeasures(measureName);
	}

	static getPerformanceMeasureByName(measureName) {
		const measures = [];

		if (window.performance && window.performance.getEntriesByName) {
			measures.push(...window.performance.getEntriesByName(measureName));
		}

		return measures;
	}

	static perfMark(markName) {
		if (!window.performance || !window.performance.mark) {
			return;
		}

		window.performance.mark(markName);
	}

	static clearMarks(markNames) {
		if (!window.performance || !window.performance.clearMarks) {
			return;
		}

		markNames.forEach((mark) => window.performance.clearMarks(mark));
	}
}

export default PerformanceHelper;
