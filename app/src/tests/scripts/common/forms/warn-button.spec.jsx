import WarnButton from '../../../../scripts/common/forms/warn-button';

describe('component WarnButton', () => {
    it('renders successfully', () => {
        const wrapper = shallow(
            <WarnButton message="A Button!"/>
        );
        expect(wrapper).toMatchSnapshot();
    });
    it('renders with warnings disable', () => {
        const wrapper = shallow(
            <WarnButton message="A Button!" warn={false}/>
        );
        expect(wrapper).toMatchSnapshot();
    })
});
