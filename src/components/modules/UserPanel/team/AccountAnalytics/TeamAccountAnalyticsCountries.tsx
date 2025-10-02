import Flag from "react-world-flags";

interface Country {
  country_name: string;
  country_flag: string;
  total_sales: number;
  percentage: number;
}

interface CountriesProps {
  countries: Country[];
  isLoading: boolean;
  error: any;
}

function TeamAccountAnalyticsCountriesSkeleton() {
  return (
    <div className="team-account-analytic-content px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5 animate-pulse">
      <div className="h-6 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="mt-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="bg-[#f9f9fe] dark:bg-[#0F163A] rounded-lg px-4 sm:px-[2rem] py-3 border-standard mt-4"
          >
            <div className="flex justify-between items-center text-[var(--main-background)] dark:text-white">
              <div className="flex items-center gap-3">
                <div className="w-[5rem] h-[5rem] rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex justify-between items-center gap-4 mt-3">
              <div className="w-full rounded-xl bg-white overflow-hidden h-[.8rem] p-[1px] relative">
                <div
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl p-[2px] h-full min-w-fit"
                  style={{ width: `60%` }}
                />
              </div>
              <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const formattedPrice = (price: number) => {
  if (price >= 1_000_000_000) {
    return (price / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (price >= 1_000) {
    return (price / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return price.toString();
  }
};

export default function TeamAccountAnalyticsCountries({
  countries,
  isLoading,
  error,
}: CountriesProps) {
  if (isLoading) return <TeamAccountAnalyticsCountriesSkeleton />;
  if (error) return <div>Error loading data</div>;
  return (
    <div className="team-account-analytic-content px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5">
      <p className="text-[var(--main-background)] dark:text-white">
        Countries of the members in your organization
      </p>
      <div className="mt-4">
        {countries.map((country, idx) => (
          <div
            key={country.country_name + idx}
            className="bg-[#f9f9fe] dark:bg-[#0F163A] rounded-lg px-4 sm:px-[2rem] py-3 border-standard mt-4"
          >
            <div className="flex justify-between items-center text-[var(--main-background)] dark:text-white">
              <div className="flex items-center gap-2">
                <div className="flex w-20 h-20 items-center gap-3 rounded-full overflow-hidden">
                  <Flag
                    code={country.country_flag}
                    className="w-full h-full rounded-sm object-cover"
                  />
                </div>
                <p className="text-[var(--main-background)] dark:text-white">
                  {country.country_name}
                </p>
              </div>
              <p>$ {formattedPrice(country.total_sales)}</p>
            </div>
            <div className="flex justify-between items-center gap-4 mt-3">
              <div className="w-full rounded-xl bg-[#d0d0d0] dark:bg-white overflow-hidden h-[.8rem] relative">
                <div
                  className={`bg-[#1a68ff] rounded-r-xl p-[2px] h-full flex items-center justify-center min-w-fit`}
                  style={{ width: `${country.percentage}%` }}
                ></div>
              </div>
              <p className="text-[var(--main-background)] dark:text-[#dddddd81]">
                {country.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
