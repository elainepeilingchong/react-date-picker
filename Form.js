import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import SetupDatePicker from './SetupDatePicker';
export const required = val => (val ? undefined : "WRONG");
import { connect } from 'react-redux';
import DatePicker from './FromScratch';
import Moment from 'moment';

function ReactForm() {

    const renderInput = ({ input: { onChange, ...restInput } }) => {
        return <TextInput style={styles.input} onChangeText={onChange} {...restInput} />
    }

    return (
        <View style={styles.container}>
            <Text>Form 1</Text>
            <Field
                name="trainingStartTime"
                placeholder="What time did it start?"
                heading="What time did it start?"
                component={SetupDatePicker}
                mode="time"
                dateFormat="HH:mm"
                containerStyle={styles.datePickerContainerStyle}
                // validate={[required, this.isTrainingStartValid]}
                focusForAnalytics={() => {
                    this.trainingStartTimeFocus = true;

                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    datePickerContainerStyle: {
        // marginBottom: '40@ms',
    },
});
const mapStateToProps = state => {
    let trainingStartTime = null;

    trainingStartTime = Moment
        .utc(1544637929100)
        .format('HH:mm'); 

    let formValues = {};
    if (state.form.test && state.form.test.values) {
        if (state.form.test.values.trainingStartTime) {
            ({ trainingStartTime } = state.form.test.values);
        }
        formValues = state.form.test.values;
    }

    return {
        test: state.form.test,
        initialValues: {
            ...formValues,
            trainingStartTime: trainingStartTime,
        },
    };
}
export default connect(mapStateToProps)(
    reduxForm({
        form: "test",
        destroyOnUnmount: false,
        enableReinitialize: true,
    })(ReactForm),
);
