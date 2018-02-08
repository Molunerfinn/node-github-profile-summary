<template lang="pug">
  .profile(v-loading.fullscreen="loading")
    .container
      .row.user-info(v-if="userInfo.name !== undefined")
        .col-xs-6.col-xs-offset-3.col-sm-2.col-sm-offset-5
          img.user-avatar(:src="userInfo.avatarUrl", alt="", cross-origin="anonymous")
        .col-xs-12.user-name
          span.key-text {{ userInfo.username }}
          span(v-if="userInfo.name") ({{ userInfo.name }})
        .col-xs-12.user-bio
          | {{ userInfo.bio }}
        .user-info__cards.pull-left
          .col-xs-12.col-sm-6.col-lg-3
            .user-info__card
              | {{ userInfo.email || 'Null' }}
              .user-info__card-status.pull-right
                i.fa.fa-envelope(aria-hidden="true")
          .col-xs-12.col-sm-6.col-lg-3
            .user-info__card
              | Joined at {{ userInfo.createdAt.slice(0, 10) }}
              .user-info__card-status.pull-right
                i.fa.fa-calendar(aria-hidden="true")
          .col-xs-12.col-sm-6.col-lg-3
            .user-info__card
              | Owned public repos
              .user-info__card-status.pull-right
                | {{ userRepos.totalCount }}
          .col-xs-12.col-sm-6.col-lg-3
            .user-info__card
              | Contributed last year
              .user-info__card-status.pull-right
                | {{ userCommits.total }}
      .row.chart-lists.user-contribution
        .col-xs-12.section-title
          | Contributions in the last year - {{ userCommits.total }}
        .col-xs-12.chart-area
          line-chart(:chart-data="contribution.data" :options="contribution.options" :style="contribution.styles")
      .row.chart-lists.user-repos
        .col-xs-12.col-md-6
          .section-title
            | Stars per Repo(top 10)
          pie-chart(:chart-data="userStarsChart.data" :options="pieChartOptions" :style="contribution.styles")
        .col-xs-12.col-md-6
          .section-title
            | Commits per Repo(top 10)
          pie-chart(:chart-data="userCommitsChart.data" :options="pieChartOptions" :style="contribution.styles")
      .row.chart-lists.user-repos
        .col-xs-12.col-md-6
          .section-title
            | Repos per Language
          radar-chart(:chart-data="userRepoLanguagesChart.data" :options="radarChartOptions" :style="contribution.styles")
        .col-xs-12.col-md-6
          .section-title
            | Stars per Language
          bar-chart(:chart-data="userLanguageStarsChart.data" :options="barChartOptions" :style="contribution.styles")
</template>
<script>
import LineChart from '@/components/LineChart.js'
import PieChart from '@/components/PieChart.js'
import RadarChart from '@/components/RadarChart.js'
import BarChart from '@/components/BarChart.js'
export default {
  name: 'Profile',
  components: {
    LineChart,
    PieChart,
    RadarChart,
    BarChart
  },
  data () {
    return {
      username: this.$route.params.username,
      userInfo: {},
      userRepos: [],
      userCommits: [],
      contribution: {
        data: null,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title (item) {
                return item[0].yLabel + ' commits'
              }
            }
          }
        },
        styles: {
          height: '300px',
          position: 'relative'
        }
      },
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'left'
        }
      },
      radarChartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      },
      userStarsChart: {
        data: null
      },
      userCommitsChart: {
        data: null
      },
      userRepoLanguagesChart: {
        data: null
      },
      userLanguageStarsChart: {
        data: null
      },
      colorPlatte: [
        'rgba(7,144,232, 0.7)',
        'rgba(49,174,255, 0.7)',
        'rgba(73,177,245, 0.7)',
        'rgba(20,196,255, 0.7)',
        'rgba(26,216,249, 0.7)',
        'rgba(0,238,255, 0.7)',
        'rgba(0,238,255, 0.7)',
        'rgba(116,254,244, 0.7)',
        'rgba(140,228,222, 0.7)',
        'rgba(180,225,193, 0.7)'
      ],
      loading: true
    }
  },
  methods: {
    async getData () {
      this.loading = true
      const res = await this.$http.get(`/api/user-profile/${this.username}`)
      if (res.data.success) {
        this.userInfo = res.data.userInfo
        this.userRepos = res.data.userRepos
        this.userCommits = res.data.userCommits
        localStorage.setItem(this.username, JSON.stringify(res.data))
        this.initUserContributionChart(this.userCommits)
        this.initUserReposChart(this.userRepos)
        this.loading = false
      }
    },
    checkLocalStorage () {
      let userData = localStorage.getItem(this.username)
      if (!userData) {
        return false
      } else {
        userData = JSON.parse(userData)
        this.userInfo = userData.userInfo
        this.userRepos = userData.userRepos
        this.userCommits = userData.userCommits
        this.initUserContributionChart(this.userCommits)
        this.initUserReposChart(this.userRepos)
        this.loading = false
        return true
      }
    },
    initUserContributionChart (obj) {
      let arr = []
      let labels = []
      obj.contribution.map(item => {
        arr.push(item.count)
        labels.push(`${item.year}-${item.month}`)
      })
      this.contribution.data = {
        labels,
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(73,177,245,0.7)',
            data: arr
          }
        ]
      }
    },
    initUserReposChart (obj) {
      let repos = obj.edges.slice()
      let arr = []
      let labels = []

      // user stars chart
      repos.sort((x, y) => {
        return y.node.stargazers.totalCount - x.node.stargazers.totalCount
      })
      const starsTop10 = repos.slice(0, 10)
      starsTop10.forEach(item => {
        arr.push(item.node.stargazers.totalCount)
        labels.push(`${item.node.name} - ${item.node.stargazers.totalCount}`)
      })
      this.userStarsChart.data = {
        labels,
        datasets: [
          {
            label: '',
            data: arr,
            backgroundColor: this.colorPlatte
          }
        ]
      }

      // user commits chart
      repos.sort((x, y) => {
        return y.node.defaultBranchRef.target.history.totalCount - x.node.defaultBranchRef.target.history.totalCount
      })
      const commitsTop10 = repos.slice(0, 10)
      const commitsArr = []
      const commitsLabels = []
      commitsTop10.forEach(item => {
        const count = item.node.defaultBranchRef.target.history.totalCount
        commitsArr.push(count)
        commitsLabels.push(`${item.node.name} - ${count}`)
      })
      this.userCommitsChart.data = {
        labels: commitsLabels,
        datasets: [
          {
            label: '',
            data: commitsArr,
            backgroundColor: this.colorPlatte
          }
        ]
      }

      // user repo language
      const languages = {}
      const languageStars = {}
      repos.forEach(item => {
        if (item.node.primaryLanguage) {
          languages[item.node.primaryLanguage.name] ? languages[item.node.primaryLanguage.name] += 1 : languages[item.node.primaryLanguage.name] = 1

          languageStars[item.node.primaryLanguage.name] === undefined ? languageStars[item.node.primaryLanguage.name] = item.node.stargazers.totalCount : languageStars[item.node.primaryLanguage.name] += item.node.stargazers.totalCount
        } else {
          languages['Unknown'] ? languages['Unknown'] += 1 : languages['Unknown'] = 1

          languageStars['Unknown'] === undefined ? languages['Unknown'] = item.node.stargazers.totalCount : languageStars['Unknown'] += item.node.stargazers.totalCount
        }
      })
      const languagesArr = []
      for (let i in languages) {
        const obj = {
          language: i,
          stars: languageStars[i] || 0,
          count: languages[i]
        }
        languagesArr.push(obj)
      }
      languagesArr.sort((x, y) => {
        return y.stars - x.stars
      })
      this.userRepoLanguagesChart.data = {
        labels: languagesArr.map(item => item.language),
        datasets: [
          {
            label: 'Languages',
            data: languagesArr.map(item => item.count),
            backgroundColor: 'rgba(73,177,245,0.7)'
          }
        ]
      }

      // user language stars
      this.userLanguageStarsChart.data = {
        labels: languagesArr.map(item => item.language),
        datasets: [
          {
            label: 'Languages',
            data: languagesArr.map(item => item.stars),
            backgroundColor: this.colorPlatte
          }
        ]
      }
    }
  },
  created () {
    if (!this.checkLocalStorage()) {
      this.getData()
    }
    document.title = `${this.username}'s Github Profile Summary`
  }
}
</script>
<style lang="stylus">
  .profile
    padding-top 20px
    padding-bottom 60px
    .user
      &-info
        text-align center
        &__cards
          margin-top 12px
          width 100%
        &__card
          background #fff
          height 80px
          line-height 56px
          text-align left
          padding 12px
          color #4c4948
          margin-bottom 15px
          font-size 18px
          &-status
            text-align center
            width 56px
            height 56px
            background #49b1f5
            color #fff
            line-height 56px
            font-weight bold
            i
              font-size 24px
              line-height 55px
      &-avatar
        width 100%
      &-name
        margin 8px 0
      &-bio
        font-size 14px
        color #aaa
  .key-text
    font-weight bold
  .chart-lists
    margin-bottom 20px
  .section-title
    margin 8px 0 12px
    font-size 24px
  .user-contribution
    .chart-area
      height 300px
</style>
