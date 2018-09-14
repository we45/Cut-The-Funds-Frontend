<template>
  <div>
  <b-container fluid>
    <b-row>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search"/>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6" class="my-1">
      </b-col>
    </b-row>
    <br>
    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0"/>
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage"/>
        </b-form-group>
      </b-col>
    </b-row>

    <b-table show-empty
             stacked="md"
             :items="dataItems"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             @filtered="onFiltered"
    >
      <template slot="_id" slot-scope="row">
      <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
          Edit
        </b-button>
      </template>
    </b-table>
  </b-container>
    </div>
</template>

<script>
  const items = [
  ]

  export default {
    name: 'ProjectsTable',
    props: {
      dataItems: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        // items: items,
        fields: [
          {key: 'name', label: 'Project name', sortable: true},
          {key: 'manager', label: 'Manager', sortable: true, 'class': 'text-center'},
          {key: 'limit', label: 'Limit'},
          {key: '_id', label: ' Action'}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: items.length,
        pageOptions: [5, 10, 15],
        sortBy: null,
        sortDesc: false,
        filter: null,
        modalInfo: {title: '', content: ''}
      }
    },
    computed: {
    },
    methods: {
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      info (item, index, button) {
      this.modalInfo.title = `Row index: ${index}`
      this.modalInfo.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    }
  }

</script>

<style scoped>

</style>
