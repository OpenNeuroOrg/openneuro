import Footer from '../footer';

describe('common/partials/footer', () => {
    it('renders successfully', () => {
        const wrapper = shallow(
            <Footer version="1.0.0" />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
