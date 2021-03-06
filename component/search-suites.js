import clone from 'clone'

let matches = (search, match) => {
  return search.trim().toLowerCase().split(' ').every(word => match.toLowerCase().includes(word))
}

export default (suites, search) => {
  suites = clone(suites)
  suites = suites.filter(suite => {
    return suite.name === 'Properties' ? true : matches(search.suites, suite.name)
  })

  suites.forEach(suite => {
    if (suite.tests) {
      suite.tests = suite.tests.filter(test => {
        return matches(search.tests, test.name) | matches(search.tests, test.message)
      })
    }

    if (suite.properties) {
      let properties = {}
      properties._uuid = suite.properties._uuid
      Object.keys(suite.properties).forEach(key => {
        let value = suite.properties[key]
        if (matches(search.properties, key) || matches(search.properties, value)) properties[key] = value
      })

      suite.properties = properties
    }
  })
  return suites.filter(suite => (suite.tests && suite.tests.length > 0) || suite.name === 'Properties') 
}
