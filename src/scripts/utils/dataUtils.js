export default {

	parseStatus(notes) {
        let status = {};
        if (notes) {
            for (let note of notes) {
                if (note.author === 'uploadStatus' && note.text === 'incomplete') {
                    status['uploadIncomplete'] = true;
                }
            }
        }
        return status;
    }
}