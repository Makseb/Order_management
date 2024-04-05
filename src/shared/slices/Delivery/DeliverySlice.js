
import { createSlice } from '@reduxjs/toolkit';

export const DeliveryInitialState = {
    uber: { token: undefined, quote: undefined, create: undefined, webhook: [] },
    organizations: [{ name: "Uber direct", options: [{ name: "Automatic", checked: false }, { name: "Manual", checked: true }] }, { name: "Test 1", options: [{ name: "Automatic", checked: false }, { name: "Manual", checked: false }] },{ name: "AAA", options: [{ name: "Automatic", checked: false }, { name: "Manual", checked: false }] }],
};

export const deliverySlice = createSlice({
    name: 'delivery',
    initialState: DeliveryInitialState,
    reducers: {
        setUberToken: (state, action) => {
            state.uber.token = action.payload.ubertoken
        },
        setUberQuote: (state, action) => {
            state.uber.quote = action.payload.quote
        },
        resetUber: (state) => {
            state.uber.quote = undefined
            state.uber.create = undefined
            // state.uber.token = undefined
        },
        setUberCreate: (state, action) => {
            state.uber.create = action.payload.create
        },
        setWebhook: (state, action) => {
            let data = state.uber.webhook
            const index = state.uber.webhook.findIndex(webhook => webhook.uberId === action.payload.uberId)
            if (index === -1) {
                data.push({ uberId: action.payload.uberId, counter: 1 })
            } else {
                data[index].counter = data[index].counter + 1
            }
            state.uber.webhook = data
        },
        resetWebhook: (state, action) => {
            let data = state.uber.webhook
            const index = state.uber.webhook.findIndex(webhook => webhook.uberId === action.payload.uberId)
            if (index !== -1) {
                data[index].counter = 0
                state.uber.webhook = data
            }
        },
        setOption: (state, action) => {
            const index = state.organizations.findIndex(organization => organization.name === action.payload.organization)
            if (index !== -1) {
                // set all the ckeckbox of all organization except the targeteted organization to false.
                const updatedOrganizations = state.organizations.map((org, idx) => ({
                    ...org,
                    options: org.options.map(option => ({ ...option, checked: idx !== index && false }))
                }));
                state.organizations = updatedOrganizations

                let data = state.organizations[index].options
                if (data.filter(option => option.checked).length === 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (action.payload.state === data[i].name) {
                            data[i].checked = !data[i].checked
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) {
                        data[i].checked = !data[i].checked
                    }
                }
                state.organizations[index].options = data
                // console.log(state.organizations[index].options);
            }
        },
        setOptionsOff: (state) => {
            const updatedOrganizations = state.organizations.map((org) => ({
                ...org,
                options: org.options.map(option => ({ ...option, checked: false }))
            }));
            state.organizations = updatedOrganizations
        }
    },
});

export const { setUberToken, setUberQuote, resetUber, setUberCreate, setWebhook, resetWebhook, setOption,setOptionsOff } = deliverySlice.actions;
