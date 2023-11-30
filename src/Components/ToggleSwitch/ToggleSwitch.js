import { Switch } from 'react-native-switch';

export default function ToggleSwitch({ isEnabled, toggleSwitch }) {
    return (
        <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            disabled={false}
            activeText={'On'}
            inActiveText={'Off'}
            circleSize={30}
            // barHeight={1}
            // circleBorderWidth={3}
            backgroundActive={'white'} // #e7e7e7
            backgroundInactive={'white'}
            circleActiveColor={'#df8f17'}
            circleInActiveColor={'#df8f17'} //#df8f17
            // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
            innerCircleStyle={{ alignItems: "center", justifyContent: "center", borderWidth: 0 }} // style for inner animated circle for what you (may) be rendering inside the circle
            outerCircleStyle={{}} // style for outer animated circle
            containerStyle={
                {
                    borderWidth: 1,
                    borderColor: '#df8f17'
                }
            }
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
        />
    )
}