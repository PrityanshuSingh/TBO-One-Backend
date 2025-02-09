const axios = require('axios');

async function searchSightseeing(options) {
    const url = 'https://SightseeingBE.tektravels.com/SightseeingService.svc/rest/Search';

    const data = {
        CityId: options.cityId,
        CountryCode: options.countryCode,
        FromDate: options.fromDate,
        ToDate: options.toDate,
        AdultCount: options.adultCount || 1,
        ChildCount: options.childCount || 0,
        ChildAge: options.childAge || null,
        PreferredLanguage: options.preferredLanguage || 0,
        PreferredCurrency: options.preferredCurrency || "INR",
        IsBaseCurrencyRequired: options.isBaseCurrencyRequired || false,
        EndUserIp: options.endUserIp,
        TokenId: options.tokenId,
        KeyWord: options.keyWord || ""
    };

    try {
        const response = await axios.post(url, data);
        // console.log("sight seeing response",response.data)
        return response.data?.Response?.SightseeingSearchResults;
    } catch (error) {
        console.error('Error fetching sightseeing data:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = searchSightseeing;