import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Platform,
    Animated,
    Keyboard
} from 'react-native';
import Moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScaledSheet } from 'react-native-size-matters';

const FORMATS = {
    'date': 'YYYY-MM-DD',
    'datetime': 'YYYY-MM-DD HH:mm',
    'time': 'HH:mm'
};

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right'];

class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: this.getDate(),
            modalVisible: false,
            animatedHeight: new Animated.Value(0),
            allowPointerEvents: true
        };

        this.getDate = this.getDate.bind(this);
        this.getDateStr = this.getDateStr.bind(this);
        this.datePicked = this.datePicked.bind(this);
        this.onPressDate = this.onPressDate.bind(this);
        this.onPressCancel = this.onPressCancel.bind(this);
        this.onPressConfirm = this.onPressConfirm.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onPressMask = this.onPressMask.bind(this);
        this.setModalVisible = this.setModalVisible.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.date !== prevProps.date) {
            this.setState({ date: this.getDate(this.props.date) });
        }
    }

    setModalVisible(visible) {
        const { height, duration } = this.props;

        if (visible) {
            this.setState({ modalVisible: visible });
            return Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: height,
                    duration: duration,
                    useNativeDriver: true
                }
            ).start();
        } else {
            return Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: true
                }
            ).start(() => {
                this.setState({ modalVisible: visible });
            });
        }
    }

    onPressMask() {
        if (typeof this.props.onPressMask === 'function') {
            this.props.onPressMask();
        } else {
            this.onPressCancel();
        }
    }

    onPressCancel() {
        this.setModalVisible(false);
        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    onPressConfirm() {
        this.datePicked();
        this.setModalVisible(false);

        if (typeof this.props.onCloseModal === 'function') {
            this.props.onCloseModal();
        }
    }

    getDate(date = this.props.date) {
        const { mode, minDate, maxDate, format = FORMATS[mode] } = this.props;

        if (!date) {
            let now = new Date();
            if (minDate) {
                let _minDate = this.getDate(minDate);

                if (now < _minDate) {
                    return _minDate;
                }
            }

            if (maxDate) {
                let _maxDate = this.getDate(maxDate);

                if (now > _maxDate) {
                    return _maxDate;
                }
            }

            return now;
        }

        if (date instanceof Date) {
            return date;
        }

        return Moment(date, format).toDate();
    }

    getDateStr(date = this.props.date) {
        const { mode, format = FORMATS[mode] } = this.props;

        const dateInstance = date instanceof Date
            ? date
            : this.getDate(date);

        if (typeof this.props.getDateStr === 'function') {
            return this.props.getDateStr(dateInstance);
        }

        return Moment(dateInstance).format(format);
    }

    datePicked() {
        if (typeof this.props.onDateChange === 'function') {
            this.props.onDateChange(this.getDateStr(this.state.date), this.state.date);
        }
    }

    getTitleElement() {
        const { date, placeholder, customStyles, allowFontScaling } = this.props;

        if (!date && placeholder) {
            return (
                <Text allowFontScaling={allowFontScaling} style={[styles.placeholderText, customStyles.placeholderText]}>
                    {placeholder}
                </Text>
            );
        }

        return (
            <Text allowFontScaling={allowFontScaling} style={[styles.dateText, customStyles.dateText]}>
                {this.getDateStr()}
            </Text>
        );
    }

    onDateChange(event, date) {
        if (Platform.OS == "android") {
            this.setModalVisible(false);
        }
        if (date) {
            this.setState({
                allowPointerEvents: false,
                date: date
            });
            const timeoutId = setTimeout(() => {
                this.setState({
                    allowPointerEvents: true
                });
                clearTimeout(timeoutId);
            }, 200);
            this.datePicked();

        }



    }

    onPressDate() {
        console.log('triggered')
        if (this.props.disabled) {
            return true;
        }

        Keyboard.dismiss();

        this.setState({
            date: this.getDate()
        });

        this.setModalVisible(true);

        if (typeof this.props.onOpenModal === 'function') {
            this.props.onOpenModal();
        }
    }


    render() {
        const {
            mode,
            style,
            customStyles,
            disabled,
            minDate,
            maxDate,
            minuteInterval,
            cancelBtnText,
            confirmBtnText,
            testID,
            cancelBtnTestID,
            confirmBtnTestID,
            allowFontScaling,
            locale,
            displayType
        } = this.props;

        const dateInputStyle = [
            styles.dateInput, customStyles.dateInput,
            disabled && styles.disabled,
            disabled && customStyles.disabled
        ];

        return (
            <TouchableOpacity
                style={[styles.dateTouch, style]}
                underlayColor={'transparent'}
                onPress={this.onPressDate}
                testID={testID}
            >
                <View style={[styles.dateTouchBody, customStyles.dateTouchBody]}>
                    {
                        !this.props.hideText ?
                            <View style={dateInputStyle}>
                                {this.getTitleElement()}
                            </View>
                            :
                            <View />
                    }
                    {Platform.OS === 'ios' && <Modal
                        transparent={true}
                        animationType="none"
                        visible={this.state.modalVisible}
                        supportedOrientations={SUPPORTED_ORIENTATIONS}
                        onRequestClose={() => { this.setModalVisible(false); }}
                    >
                        <View
                            style={{ flex: 1 }}
                        >
                            <TouchableOpacity
                                style={styles.datePickerMask}
                                activeOpacity={1}
                                underlayColor={'#00000077'}
                                onPress={this.onPressMask}
                            >
                                <TouchableOpacity
                                    underlayColor={'#fff'}
                                    style={{ flex: 1 }}
                                >
                                    <Animated.View
                                        style={[styles.datePickerCon, { height: this.state.animatedHeight }, customStyles.datePickerCon]}
                                    >
                                        <View pointerEvents={this.state.allowPointerEvents ? 'auto' : 'none'}>
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={this.state.date}
                                                minimumDate={minDate && this.getDate(minDate)}
                                                maximumDate={maxDate && this.getDate(maxDate)}
                                                mode={mode}
                                                onChange={this.onDateChange}
                                                is24Hour={true}
                                                minuteInterval={minuteInterval}
                                                style={[styles.datePicker, customStyles.datePicker]}
                                                locale={locale}
                                                display={displayType}

                                            />
                                        </View>
                                        <TouchableOpacity
                                            underlayColor={'transparent'}
                                            onPress={this.onPressCancel}
                                            style={[styles.btnText, styles.btnCancel, customStyles.btnCancel]}
                                            testID={cancelBtnTestID}
                                        >
                                            <Text
                                                allowFontScaling={allowFontScaling}
                                                style={[styles.btnTextText, styles.btnTextCancel, customStyles.btnTextCancel]}
                                            >
                                                {cancelBtnText}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            underlayColor={'transparent'}
                                            onPress={this.onPressConfirm}
                                            style={[styles.btnText, styles.btnConfirm, customStyles.btnConfirm]}
                                            testID={confirmBtnTestID}
                                        >
                                            <Text allowFontScaling={allowFontScaling}
                                                style={[styles.btnTextText, customStyles.btnTextConfirm]}
                                            >
                                                {confirmBtnText}
                                            </Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </Modal>}

                    {Platform.OS === 'android' && <View>
                        {this.state.modalVisible && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={this.state.date}
                                minimumDate={minDate && this.getDate(minDate)}
                                maximumDate={maxDate && this.getDate(maxDate)}
                                mode={mode}
                                onChange={this.onDateChange}
                                is24Hour={true}
                                style={[style.datePicker, customStyles.datePicker]}
                                display={displayType}
                                is24Hour={true}
                                minuteInterval={minuteInterval}
                                style={[styles.datePicker, customStyles.datePicker]}
                                locale={locale}
                            />
                        )}

                    </View>}
                </View>
            </TouchableOpacity>
        );
    }
}

DatePicker.defaultProps = {
    mode: 'date',
    displayType: 'default',
    date: '',
    height: 259,
    duration: 300,
    confirmBtnText: 'Confirm',
    cancelBtnText: 'Cancel',
    customStyles: {},
    disabled: false,
    allowFontScaling: true,
    hideText: false,
    placeholder: '',
    modalOnResponderTerminationRequest: e => true
};

DatePicker.propTypes = {
    mode: PropTypes.oneOf(['date', 'datetime', 'time']),
    displayType: PropTypes.oneOf(['clock', 'calendar', 'spinner', 'default']),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.object]),
    format: PropTypes.string,
    minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    height: PropTypes.number,
    duration: PropTypes.number,
    confirmBtnText: PropTypes.string,
    cancelBtnText: PropTypes.string,
    customStyles: PropTypes.object,
    disabled: PropTypes.bool,
    allowFontScaling: PropTypes.bool,
    onDateChange: PropTypes.func,
    onOpenModal: PropTypes.func,
    onCloseModal: PropTypes.func,
    onPressMask: PropTypes.func,
    placeholder: PropTypes.string,
    modalOnResponderTerminationRequest: PropTypes.func,
    is24Hour: PropTypes.bool,
    getDateStr: PropTypes.func,
    locale: PropTypes.string
};


const styles = ScaledSheet.create({
    dateTouch: {
        width: "100%"
    },
    dateTouchBody: {
        flexDirection: 'row',

        height: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#aaa',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateText: {
        color: '#333'
    },
    placeholderText: {
        color: '#c9c9c9'
    },
    datePickerMask: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: '#00000077'
    },
    datePickerCon: {
        backgroundColor: '#fff',
        height: 0,
        overflow: 'hidden'
    },
    btnText: {
        position: 'absolute',
        top: 0,
        height: 42,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTextText: {
        fontSize: 16,
        color: '#46cf98'
    },
    btnTextCancel: {
        color: '#666'
    },
    btnCancel: {
        left: 0
    },
    btnConfirm: {
        right: 0
    },
    datePicker: {
        marginTop: 42,
        borderTopColor: '#ccc',
        borderTopWidth: 1
    },
    disabled: {
        backgroundColor: '#eee'
    }
});


export default DatePicker;
