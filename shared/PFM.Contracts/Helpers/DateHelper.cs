using System.Globalization;

namespace PFM.Contracts.Helpers;

public static class DateHelper
{
    public static bool IsValidYearMonth(this string value)
    {
        return DateTime.TryParseExact(
            value,
            "yyyy-MM",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out _);
    }
}