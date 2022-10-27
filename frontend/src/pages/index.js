import Head from 'next/head'
import {
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { Budget } from '../components/dashboard/budget'
import { LatestOrders } from '../components/dashboard/latest-orders'
import { LatestProducts } from '../components/dashboard/latest-products'
import { Sales } from '../components/dashboard/sales'
import { TasksProgress } from '../components/dashboard/tasks-progress'
import { TotalCustomers } from '../components/dashboard/total-customers'
import { TotalProfit } from '../components/dashboard/total-profit'
import { TrafficByDevice } from '../components/dashboard/traffic-by-device'
import { DashboardLayout } from '../components/dashboard-layout'
import { useDataContext } from '../contexts/data-context'

const CircularProgressLoadingScreen = () => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
      <Box sx={{ mt: 2 }}>
        <Typography color="textPrimary" variant="h5">
          Loading...
        </Typography>
      </Box>
    </Box>
  )
}

const Page = () => {
  const {
    data,
    isLoading,
    chartData,
    selectedCountry,
    selectedCountryIndicator,
    setSelectedCountry,
    setSelectedCountryIndicator,
    mode,
  } = useDataContext()
  console.log(data)
  return (
    <>
      <Head>
        <title>Dashboard | Gator Tells</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        {isLoading ? (
          <CircularProgressLoadingScreen />
        ) : (
          <>
            <Container maxWidth={false} style={{ marginBottom: '20px' }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={data?.countries.map((c, i) => ({
                      label: c,
                      id: i,
                    }))}
                    value={selectedCountry}
                    onChange={(event, newValue) => {
                      setSelectedCountry(newValue?.label || '')
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Country" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={data?.indicator_name.map((c, i) => ({
                      label: c,
                      id: i,
                    }))}
                    onChange={(event, newValue) => {
                      setSelectedCountryIndicator(newValue?.label || '')
                    }}
                    value={selectedCountryIndicator}
                    renderInput={(params) => (
                      <TextField {...params} label="Indicator" />
                    )}
                  />
                </Grid>
              </Grid>
            </Container>
            <Container maxWidth={false}>
              <Typography color="textPrimary" variant="h4">
                {mode === "analysis" ? "Analysis of Sustainable Trend Queries" : "Forecasting of Sustainable Trend Queries"}
              </Typography>
              <Grid container spacing={3}>
                {data &&
                  !isLoading &&
                  Object.keys(chartData)?.map((indicator, i) => (
                    <Grid key={i} item lg={6} md={12} xl={9} xs={12}>
                      <Sales
                        indicator={indicator}
                        data={chartData[indicator].value}
                        year={chartData[indicator].year}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Container>
          </>
        )}
      </Box>
    </>
  )
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Page
