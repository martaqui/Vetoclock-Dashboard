import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DatePickerComponent.css' // Asegúrate de importar tu archivo CSS

interface DatePickerComponentProps {
    startDate: Date | null
    endDate: Date | null
    // selectedYear: string
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
    // handleYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
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
                    selected={endDate} // Shorthand prop, listed first
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="MMMM yyyy"
                    placeholderText="Hasta"
                    minDate={startDate || undefined}
                    onChange={(date) => setEndDate(date)}
                />
            </div>
            {/* Selector de Año
            <div className="year-select-container">
                <label htmlFor="year">Selecciona el año:</label>
                <select
                    id="year"
                    value={selectedYear}
                    onChange={handleYearChange}
                >
                    <option value="--">--</option>
                    {[...Array(2026 - 2016)].map((_, index) => (
                        <option key={index} value={2016 + index}>
                            {2016 + index}
                        </option>
                    ))}
                </select>
            </div> */}
        </div>
    )
}

DatePickerComponent.propTypes = {
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    // selectedYear: PropTypes.string,
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
    // handleYearChange: PropTypes.func.isRequired,
}

export default DatePickerComponent
