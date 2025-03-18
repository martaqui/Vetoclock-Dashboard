import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePickerComponent.css' // Asegúrate de importar tu archivo CSS

interface DatePickerComponentProps {
    startDate: Date | null
    endDate: Date | null

    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
    startDate,
    endDate,
    // selectedYear,
    setStartDate,
    setEndDate,
    // handleYearChange,
}) => {
    return (
        <div className="datepicker-container">
            <div className="date-range">
                <DatePicker
                    selectsStart
                    showMonthYearPicker
                    selected={startDate} // Shorthand prop, listed first
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="MMMM yyyy"
                    placeholderText="Desde"
                    onChange={(date) => setStartDate(date)}
                />
                <DatePicker
                    selectsEnd
                    showMonthYearPicker
                    selected={endDate}
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="MMMM yyyy"
                    placeholderText="Hasta"
                    minDate={startDate || undefined}
                    onChange={(date) => setEndDate(date)}
                />
            </div>
        </div>
    )
}

DatePickerComponent.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),

    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
}

export default DatePickerComponent
