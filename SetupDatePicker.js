import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { ScaledSheet, verticalScale } from 'react-native-size-matters';
import DatePicker from './FromScratch';

class SetupDatePicker extends Component {
  render() {
    const {
      containerStyle,
      input: { onChange, value },
      mode,
      placeholder,
      dateFormat,
      dateTextStyle,
      minDate,
      maxDate,
      onClose,
      focusForAnalytics,
      center,
    } = this.props;

    const modalTextStyleIOS ={
        btnTextConfirm: { height: verticalScale(20) },
        btnTextCancel: { height: verticalScale(20) }
      };

    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <DatePicker
            style={styles.datePickerStyle}
            date={value} //18:05
            mode={mode}
            placeholder={placeholder}
            format={dateFormat}
            minDate={minDate}
            maxDate={maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            displayType="spinner"
            showIcon={false}
            customStyles={{
              dateInput: {
                borderWidth: 0,
                alignItems: center ? 'center' : 'flex-start',
              },
              dateText: [{ color: "black" }, dateTextStyle],
              placeholderText: [{ color: "black" }],
              ...modalTextStyleIOS,
            }}
            onDateChange={(v1, v2)=>{console.log('setup_____' + v1);
            // convert date to string
            onChange(v1)}} //18:05
            onCloseModal={() => {
              if (focusForAnalytics) {
                focusForAnalytics();
              }
              if (onClose) {
                onClose();
              }
            }}
          />
          
          {this.renderCheck()}
        </View>
        <Text>doe</Text>
        {this.renderUnderline()}
      </View>
    );
  }

  renderHeader() {
    const {
      input: { value },
      meta: { error, touched, dirty },
      heading,
      labelAsError,
      labelAsRequiredError,
    } = this.props;

    if (error && (touched || dirty)) {
      // (touched || dirty) &&
      let errorMessage = error;
      if (
        labelAsError ||
        (labelAsRequiredError && errorMessage === REQUIRED_MESSAGE)
      ) {
        errorMessage = heading;
      }

      return (
        <Text
          style={{}}>
          {errorMessage.toUpperCase()}
        </Text>
      );
    }

    if (value) {
      // (!pristine && valid) || (valid && value)
      return (
        <Text
          style={[
            styles.headingStyle,
            this.props.headingStyle,
          ]}>
          {heading}
        </Text>
      );
    }
    return null;
  }

  renderUnderline() {
    const { error, warning, touched, dirty } = this.props.meta;

    if ((error || warning) && (touched || dirty)) {
      // const { error, warning } = props.meta;
      const message = error || warning;

      if (message) {
        return <View style={styles.errorUnderlineStyle} />;
      }
    }
    return <View style={styles.underlineStyle} />;
  }

  renderCheck() {
    const {
      input: { value },
      meta,
    } = this.props;

    if ((!meta.pristine && meta.valid) || (meta.valid && value)) {
      <Text>right</Text>;
    }

    return null;
  }
}

const styles = ScaledSheet.create({
  containerStyle: {},
  errorStyle: {
    color: "green",
  },
  datePickerStyle: {
    width: null,
    flex: 1,
  },
  underlineStyle: {
    backgroundColor: `white`,
    height: 1,
    marginTop: '8@ms',
  },
  errorUnderlineStyle: {
    marginTop: '8@ms',
    backgroundColor: "green",
    height: 1,
  },
  headingStyle: {
    // marginBottom: '10@vs',
    marginLeft: '2@ms',
  },
  rightIconStyle: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    paddingLeft: '10@ms',
    marginRight: '10@ms',
  },
});

export default SetupDatePicker;
