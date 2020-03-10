import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function getReportList() {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'getRepList^MWR',
      data: { }
    }
  })
}

export function getReportSelections(report) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'getRepSelections^MWR',
      data: { report: report }
    }
  })
}

export function runReport(report, selections, ID, internal, RUNPREVIEW) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'runReport^MWR',
      data: { report, selections, ID, internal, RUNPREVIEW }
    }
  })
}

export function getReportTextByID(ID) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'getReportTextByID^MWR',
      data: { ID }
    }
  })
}

export function getReportTextByIdPage(ID, PAGENO) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'getReportTextByIdPage^MWR',
      data: { ID, PAGENO }
    }
  })
}

export function getReportPagesByID(ID) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'getReportPagesByID^MWR',
      data: { ID }
    }
  })
}

export function remoteLookup(query) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'remoteLookup^MWR',
      data: query
    }
  })
}

export function getReportTable(ID, reportTableCurrentRows,FULL) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'getReportTable^MWR',
      data: { ID, reportTableCurrentRows,FULL }
    }
  })
}
