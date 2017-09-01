import Validation from '../dataset.validation.jsx';

describe('dataset/Validation', () => {
    const defProps = {
        errors: [],
        warnings: [],
        validating: false,
        display: true
    };
    it('renders successfully', () => {
        const wrapper = shallow(
            <Validation {...defProps} />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('renders successfully when validating', () => {
        const wrapper = shallow(
            <Validation {...defProps} validating={true} />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('displays nothing with display set to false', () => {
        const wrapper = shallow(
            <Validation {...defProps} display={false} />
        );
        expect(wrapper.html()).toBe(null);
    });
    it('renders when the dataset is marked invalid', () => {
        const wrapper = shallow(
            <Validation {...defProps} invalid={true} />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('returns the correct message on invalid datasets', () => {
        const wrapper = shallow(
            <Validation {...defProps} invalid={true} />
        );
        expect(wrapper.contains('This does not appear to be a BIDS dataset.')).toBe(true);
    });
});
