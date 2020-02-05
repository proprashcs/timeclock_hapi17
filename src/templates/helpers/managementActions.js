module.exports = function (data) {
  if (data.state === 'approved') {
    return `<td><span class="badge badge-pill badge-success">Approved by ${data.reviewedBy}</span></td>`;
  } else if (data.state === 'rejected') {
    return `<td><span class="badge badge-pill badge-danger">Rejected by ${data.reviewedBy}</span></td>`;
  } else {
    return `<td><form style="display:inline" method="post" action="/shift/${data.id}/approve">
      <button class="btn btn-sm btn-outline-secondary" type="submit">Approve</button>
      </form>      
      <form style="display:inline" method="post" action="/shift/${data.id}/reject">
      <button class="btn btn-sm btn-outline-danger" type="submit">Reject</button>
      </form></td>`;
  }
};