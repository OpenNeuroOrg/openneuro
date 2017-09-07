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
    it('invalid dataset is not super-valid', () => {
        const wrapper = shallow(
            <Validation {...defProps} invalid={true} />
        );
        const div = wrapper.find('Panel > div.super-valid');
        expect(div).toHaveLength(0);
    });
    it('invalid dataset panel span has class ds-danger and is "Invalid"', () => {
        const validation = new Validation();
        const header = shallow(validation._header([], [], true));
        const span = header.find('span.ds-danger');
        expect(span).toHaveLength(1);
        expect(span.text()).toBe('Invalid');
    });
    it('returns the correct message on invalid datasets', () => {
        const wrapper = shallow(
            <Validation {...defProps} invalid={true} />
        );
        expect(wrapper.contains('This does not appear to be a BIDS dataset.')).toBe(true);
    });
    it('renders with default props when errors prop is undefined', () => {
        const wrapper = shallow(
            <Validation {...defProps} errors={undefined} />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('renders with default props when warnings prop is undefined', () => {
        const wrapper = shallow(
            <Validation {...defProps} warnings={undefined} />
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('renders as invalid when errors prop is undefined', () => {
        const wrapper = shallow(
            <Validation {...defProps} errors={undefined} invalid={true} />
        );
        expect(wrapper.find('Panel > div').text()).toBe('This does not appear to be a BIDS dataset. ');
    });
});
